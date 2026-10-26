create extension if not exists "pgcrypto";

create type public.user_role as enum ('researcher', 'specialist', 'expert', 'moderator', 'administrator');
create type public.node_type as enum ('problem', 'subproblem', 'hypothesis', 'result', 'method', 'evidence', 'experiment', 'question', 'barrier', 'direction');
create type public.node_status as enum ('solved', 'partial', 'open', 'debated', 'verification');
create type public.relation_type as enum ('depends', 'part', 'supports', 'contradicts', 'refines', 'uses', 'alternative', 'blocks');
create type public.bookmark_type as enum ('problem', 'node', 'paper');
create type public.publication_type as enum ('hypothesis', 'note', 'method', 'critique', 'review', 'experiment');
create type public.review_status as enum ('pending', 'approved', 'changes_requested', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 100),
  specialty text not null default '',
  interests text[] not null default '{}',
  avatar_path text,
  role public.user_role not null default 'researcher',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.disciplines (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.scientific_problems (
  id uuid primary key default gen_random_uuid(),
  discipline_id uuid not null references public.disciplines(id) on delete restrict,
  slug text unique not null,
  title text not null,
  summary text not null,
  description text not null,
  progress smallint not null default 0 check (progress between 0 and 100),
  status public.node_status not null default 'open',
  tags text[] not null default '{}',
  composition text not null,
  is_published boolean not null default false,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.graph_nodes (
  id uuid primary key default gen_random_uuid(),
  stable_id text unique not null,
  problem_id uuid not null references public.scientific_problems(id) on delete cascade,
  title text not null,
  short_description text not null,
  full_description text not null,
  role text not null default '',
  node_type public.node_type not null,
  status public.node_status not null,
  evidence_level smallint not null default 1 check (evidence_level between 1 and 5),
  position_x double precision not null,
  position_y double precision not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.graph_edges (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references public.scientific_problems(id) on delete cascade,
  source_node_id uuid not null references public.graph_nodes(id) on delete cascade,
  target_node_id uuid not null references public.graph_nodes(id) on delete cascade,
  relation_type public.relation_type not null,
  label text,
  metadata jsonb not null default '{}',
  check (source_node_id <> target_node_id),
  unique(problem_id, source_node_id, target_node_id, relation_type)
);

create table public.papers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  authors text[] not null,
  publication_year integer check (publication_year between 1500 and 2200),
  source text not null,
  abstract text not null default '',
  doi text unique,
  external_url text,
  is_demo boolean not null default false,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.node_papers (
  node_id uuid not null references public.graph_nodes(id) on delete cascade,
  paper_id uuid not null references public.papers(id) on delete cascade,
  relation_role text not null check (relation_role in ('supports', 'contradicts', 'develops', 'method', 'review')),
  note text not null default '',
  primary key(node_id, paper_id)
);

create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type public.bookmark_type not null,
  problem_id uuid references public.scientific_problems(id) on delete cascade,
  node_id uuid references public.graph_nodes(id) on delete cascade,
  paper_id uuid references public.papers(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (num_nonnulls(problem_id, node_id, paper_id) = 1)
);

create unique index bookmarks_problem_unique on public.bookmarks(user_id, problem_id) where problem_id is not null;
create unique index bookmarks_node_unique on public.bookmarks(user_id, node_id) where node_id is not null;
create unique index bookmarks_paper_unique on public.bookmarks(user_id, paper_id) where paper_id is not null;

create table public.view_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  problem_id uuid references public.scientific_problems(id) on delete cascade,
  node_id uuid references public.graph_nodes(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  check (num_nonnulls(problem_id, node_id) = 1)
);

create table public.publications (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  publication_type public.publication_type not null,
  title text not null check (char_length(title) between 8 and 240),
  body text not null check (char_length(body) between 30 and 30000),
  review_status public.review_status not null default 'pending',
  is_published boolean not null default true,
  version integer not null default 1,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.expert_reviews (
  id uuid primary key default gen_random_uuid(),
  publication_id uuid not null references public.publications(id) on delete cascade,
  reviewer_id uuid not null references auth.users(id) on delete cascade,
  verdict public.review_status not null,
  body text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique(publication_id, reviewer_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  action_url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name) values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.disciplines enable row level security;
alter table public.scientific_problems enable row level security;
alter table public.graph_nodes enable row level security;
alter table public.graph_edges enable row level security;
alter table public.papers enable row level security;
alter table public.node_papers enable row level security;
alter table public.bookmarks enable row level security;
alter table public.view_history enable row level security;
alter table public.publications enable row level security;
alter table public.expert_reviews enable row level security;
alter table public.notifications enable row level security;

create policy "Public disciplines are readable" on public.disciplines for select using (true);
create policy "Published problems are readable" on public.scientific_problems for select using (is_published);
create policy "Nodes of published problems are readable" on public.graph_nodes for select using (exists (select 1 from public.scientific_problems p where p.id = problem_id and p.is_published));
create policy "Edges of published problems are readable" on public.graph_edges for select using (exists (select 1 from public.scientific_problems p where p.id = problem_id and p.is_published));
create policy "Papers are readable" on public.papers for select using (true);
create policy "Paper links are readable" on public.node_papers for select using (true);
create policy "Own profile is readable" on public.profiles for select using (auth.uid() = id);
create policy "Own profile is editable" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Own bookmarks" on public.bookmarks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own history" on public.view_history for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Published wall is readable" on public.publications for select using (is_published or auth.uid() = author_id);
create policy "Authors create publications" on public.publications for insert with check (auth.uid() = author_id);
create policy "Authors edit drafts" on public.publications for update using (auth.uid() = author_id) with check (auth.uid() = author_id);
create policy "Reviews are readable" on public.expert_reviews for select using (true);
create policy "Experts review" on public.expert_reviews for insert with check (auth.uid() = reviewer_id and exists (select 1 from public.profiles where id = auth.uid() and role in ('expert','moderator','administrator')));
create policy "Own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Own notifications update" on public.notifications for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index graph_nodes_problem_idx on public.graph_nodes(problem_id);
create index graph_edges_problem_idx on public.graph_edges(problem_id);
create index bookmarks_user_idx on public.bookmarks(user_id, created_at desc);
create index history_user_idx on public.view_history(user_id, viewed_at desc);
create index publications_created_idx on public.publications(created_at desc) where is_published;
