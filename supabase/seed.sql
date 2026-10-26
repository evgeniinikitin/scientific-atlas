insert into public.disciplines (slug, name, description) values
('mathematics','Математика','Структуры, доказательства и границы вычислимого.'),
('biology','Биология','Молекулярные, клеточные и системные уровни живого.'),
('chemistry','Химия','Катализ, реакционные пути, материя и энергия.')
on conflict (slug) do update set name = excluded.name, description = excluded.description;

insert into public.scientific_problems (discipline_id, slug, title, summary, description, progress, tags, composition, is_published)
select d.id, seed.slug, seed.title, seed.summary, seed.summary, seed.progress, seed.tags, seed.composition, true
from (values
('mathematics','riemann-hypothesis','Гипотеза Римана','Нули дзета-функции и скрытый порядок простых чисел.',37,array['Простые числа','Комплексный анализ'],'radial'),
('mathematics','p-versus-np','P против NP','Граница между быстрым вычислением и быстрой проверкой.',24,array['Алгоритмы','Сложность'],'layers'),
('biology','mechanisms-of-aging','Механизмы старения','От повреждений ДНК до межорганных сигналов.',43,array['Геронтология','Системная биология'],'network'),
('biology','antibiotic-resistance','Устойчивость к антибиотикам','Механизмы резистентности, диагностика и терапия.',48,array['Микробиология','Эволюция'],'bipolar'),
('chemistry','artificial-photosynthesis','Искусственный фотосинтез','От поглощения фотона до химического топлива.',41,array['Фотохимия','Катализ'],'process'),
('chemistry','nitrogen-fixation','Каталитическая фиксация азота','Мягкие маршруты активации N₂ и синтеза аммиака.',32,array['Аммиак','Электрокатализ'],'orbital')
) as seed(discipline_slug,slug,title,summary,progress,tags,composition)
join public.disciplines d on d.slug = seed.discipline_slug
on conflict (slug) do update set title=excluded.title, summary=excluded.summary, progress=excluded.progress, tags=excluded.tags, composition=excluded.composition, is_published=true;

-- 12 meaningful nodes per map. Position formulas deliberately differ by composition.
with node_sets(problem_slug, titles) as (values
('riemann-hypothesis', array['Гипотеза Римана','Дзета-функция ζ(s)','Аналитическое продолжение','Функциональное уравнение','Нули в критической полосе','Распределение простых','Эквивалентные формулировки','Вычислительная проверка','Спектральный подход','Случайные матрицы','Теоремы о плотности','Нет глобального механизма']),
('p-versus-np', array['P против NP','Класс P','Класс NP','NP-полные задачи','co-NP','Полиномиальные сведения','Релятивизация','Естественные доказательства','Алгебраизация','Нижние оценки схем','Геометрическая сложность','SAT и 3-SAT']),
('mechanisms-of-aging', array['Механизмы старения','Геномная нестабильность','Укорочение теломер','Эпигенетические сдвиги','Потеря протеостаза','Митохондриальная дисфункция','Клеточная сенесценция','Истощение стволовых клеток','Иммунное старение','Хроническое воспаление','Межорганные сигналы','Комбинированные вмешательства']),
('antibiotic-resistance', array['Устойчивость к антибиотикам','Модификация мишени','Инактивация препарата','Эффлюксные насосы','Биоплёнки','Нерациональное применение','Горизонтальный перенос генов','Геномный надзор','Быстрая диагностика','Фаговая терапия','Новые классы препаратов','Антимикробный stewardship']),
('artificial-photosynthesis', array['Искусственный фотосинтез','Поглощение света','Разделение заряда','Перенос электронов','Окисление воды','Восстановление CO₂','Катализатор OER','Катализатор CO₂RR','Водород','Метанол и C₂-продукты','Фотокоррозия','Интегрированная ячейка']),
('nitrogen-fixation', array['Каталитическая фиксация азота','Активация связи N≡N','Процесс Габера — Боша','Железные катализаторы','Рутениевые катализаторы','Энергия и давление','Нитрогеназа','Электрокатализ','Фотокатализ','Литий-опосредованный путь','Конкуренция выделения H₂','Надёжная верификация NH₃'])
), expanded as (
select problem_slug, titles[i] title, i,
case when i=1 then 'problem'::public.node_type when i in (7,8,9) then 'method'::public.node_type when i in (10,12) then 'direction'::public.node_type when i=11 then 'barrier'::public.node_type else 'subproblem'::public.node_type end node_type,
case when i=1 then 'open'::public.node_status when i in (3,4) then 'solved'::public.node_status when i in (8,12) then 'verification'::public.node_status else 'partial'::public.node_status end status
from node_sets cross join lateral generate_subscripts(titles,1) as i
)
insert into public.graph_nodes (stable_id, problem_id, title, short_description, full_description, role, node_type, status, evidence_level, position_x, position_y)
select p.slug||'-'||e.i, p.id, e.title,
'Элемент демонстрационной карты: '||e.title||'.',
'Содержательная навигационная справка об элементе «'||e.title||'». Карта прототипа не заменяет систематический научный обзор.',
'Связывает локальный вопрос с общей архитектурой проблемы.',e.node_type,e.status,case when e.status='solved' then 5 else 2+(e.i%3) end,
case p.composition when 'process' then 70+e.i*130 when 'layers' then 80+((e.i-1)%4)*300 when 'bipolar' then case when e.i<6 then 90 else 980 end else 570+cos(e.i*0.524)*430 end,
case p.composition when 'process' then 180+((e.i%2)*260) when 'layers' then 80+floor((e.i-1)/4)*250 when 'bipolar' then 70+((e.i-1)%6)*115 else 390+sin(e.i*0.524)*300 end
from expanded e join public.scientific_problems p on p.slug=e.problem_slug
on conflict (stable_id) do update set title=excluded.title, position_x=excluded.position_x, position_y=excluded.position_y;

insert into public.graph_edges(problem_id, source_node_id, target_node_id, relation_type, label)
select a.problem_id, a.id, b.id, case when n%4=0 then 'supports'::public.relation_type when n%5=0 then 'blocks'::public.relation_type else 'part'::public.relation_type end, null
from public.graph_nodes a join lateral (select (regexp_match(a.stable_id,'-(\d+)$'))[1]::int n) q on true
join public.graph_nodes b on b.problem_id=a.problem_id and b.stable_id=regexp_replace(a.stable_id,'-\d+$','-1')
where q.n>1 on conflict do nothing;

insert into public.papers(title, authors, publication_year, source, abstract, is_demo) values
('Путеводитель по гипотезе Римана',array['Редакция «Научного атласа»'],2026,'Демонстрационный материал прототипа','Редакционная справка, не являющаяся библиографической записью.',true),
('Карта барьеров P против NP',array['Редакция «Научного атласа»'],2026,'Демонстрационный материал прототипа','Редакционная справка, не являющаяся библиографической записью.',true),
('Уровни биологии старения',array['Редакция «Научного атласа»'],2026,'Демонстрационный материал прототипа','Редакционная справка, не являющаяся библиографической записью.',true),
('Контуры антимикробной устойчивости',array['Редакция «Научного атласа»'],2026,'Демонстрационный материал прототипа','Редакционная справка, не являющаяся библиографической записью.',true),
('Цепочка искусственного фотосинтеза',array['Редакция «Научного атласа»'],2026,'Демонстрационный материал прототипа','Редакционная справка, не являющаяся библиографической записью.',true),
('Маршруты фиксации азота',array['Редакция «Научного атласа»'],2026,'Демонстрационный материал прототипа','Редакционная справка, не являющаяся библиографической записью.',true)
on conflict do nothing;
