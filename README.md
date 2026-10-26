# Scientific Atlas

I built this prototype around a product question: how can someone explore a complex research problem without losing the relationships between its smaller questions?

A paper list is useful once you know what you are looking for. It is less useful when you are trying to understand a field for the first time. The atlas presents a problem as a navigable map. A reader can follow connected questions, switch to a list, filter by type or status, and open the material attached to a node.

## What I decided to build

I started with six curated problem maps across three disciplines. Each map contains twelve nodes with distinct connections. The prototype has search, filters, pan and zoom, a minimap, node details, bookmarks, history, a profile, and a publication wall.

The maps are editorial examples, not an exhaustive classification of science. Demonstration materials are marked as such. This let me test the navigation and information model without pretending that a small dataset is a complete research corpus.

The public atlas runs on local data without an account. Authentication can be connected to Supabase; in the local demo, the session is explicitly stored only in the browser. The app includes a Supabase schema and row-level policies for a later move to shared data.

## Product and engineering choices

- **Map, list, and materials views.** A graph is useful for exploring connections, but not for every task. The other views keep the same content accessible when readers want to scan or find sources.
- **Evidence in the node drawer.** The detail panel keeps the question, its neighbors, and reading material together instead of sending the reader through unrelated pages.
- **Local-first demo.** Someone can evaluate the main interaction without configuring external services. User data stays local in this mode.
- **Clear prototype boundary.** OpenAlex, Semantic Scholar, and arXiv ingestion, moderation, and versioned maps are planned work; they are not represented as current features.

The implementation is a Next.js/TypeScript application. See [`ARCHITECTURE.md`](ARCHITECTURE.md) for its modules and data boundaries.

## Run locally

Node.js 20+ is required.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The atlas works without environment variables. The optional Supabase setup is in [`docs/setup.ru.md`](docs/setup.ru.md).

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Current status

This is an interactive prototype with six maps and 72 nodes. It does not ingest publications automatically or support production editorial workflows yet.
