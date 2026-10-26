import type { AtlasEdge, AtlasNode, Discipline, NodeStatus, NodeType, Paper, ScientificProblem } from "@/domains/atlas/types";

export const disciplines: Discipline[] = [
  { slug: "mathematics", name: "Математика", latin: "MATHEMATICA", index: "01", description: "Структуры, доказательства и границы вычислимого — от простых чисел до классов сложности.", tags: ["Теория чисел", "Логика", "Алгоритмы"], publications: 184 },
  { slug: "biology", name: "Биология", latin: "BIOLOGIA", index: "02", description: "Многоуровневые живые системы: молекулярные механизмы, клетки, организмы и среды.", tags: ["Генетика", "Микробиология", "Системная биология"], publications: 247 },
  { slug: "chemistry", name: "Химия", latin: "CHEMIA", index: "03", description: "Управление веществом и энергией: катализ, реакционные пути и новые материалы.", tags: ["Катализ", "Энергетика", "Материалы"], publications: 213 },
];

const demoPaper = (id: string, title: string, relation: Paper["relation"] = "даёт обзор"): Paper => ({
  id,
  title,
  authors: "Редакция «Научного атласа»",
  year: 2026,
  source: "Демонстрационный материал прототипа",
  summary: "Редакционная справка для демонстрации связи публикации с элементом карты. Не является библиографической записью.",
  relation,
  demo: true,
});

const n = (
  id: string,
  title: string,
  type: NodeType,
  status: NodeStatus,
  x: number,
  y: number,
  shortDescription: string,
  evidenceLevel = 3,
  papers?: Paper[],
): AtlasNode => ({
  id,
  title,
  type,
  status,
  x,
  y,
  shortDescription,
  fullDescription: `${shortDescription} Карта фиксирует роль этого элемента, его текущий статус и связи с соседними направлениями. Описание предназначено для навигации и не заменяет систематический научный обзор.`,
  role: type === "problem" ? "Организует всю карту и связывает основные исследовательские ветви." : "Уточняет структуру проблемы и определяет один из маршрутов дальнейшего исследования.",
  evidenceLevel,
  updatedAt: "2026-07-18",
  papers,
});

const e = (problem: string, source: string, target: string, relation: AtlasEdge["relation"], label?: string): AtlasEdge => ({
  id: `${problem}-${source}-${target}`,
  source,
  target,
  relation,
  label,
});

const riemannNodes: AtlasNode[] = [
  n("rh-core", "Гипотеза Римана", "problem", "open", 620, 320, "Все нетривиальные нули дзета-функции имеют вещественную часть 1/2.", 2, [demoPaper("p-rh-1", "Путеводитель по гипотезе Римана")]),
  n("rh-zeta", "Дзета-функция ζ(s)", "subproblem", "solved", 110, 120, "Аналитический объект, кодирующий распределение простых чисел.", 5),
  n("rh-cont", "Аналитическое продолжение", "result", "solved", 340, 40, "Продолжение ζ(s) на комплексную плоскость, кроме простого полюса.", 5),
  n("rh-func", "Функциональное уравнение", "result", "solved", 650, 30, "Симметрия значений относительно критической прямой.", 5),
  n("rh-strip", "Нули в критической полосе", "subproblem", "partial", 1010, 90, "Локализация нетривиальных нулей между 0 и 1.", 4),
  n("rh-primes", "Распределение простых", "subproblem", "partial", 1080, 330, "Точность оценки количества простых чисел до заданной границы.", 4),
  n("rh-equiv", "Эквивалентные формулировки", "evidence", "partial", 980, 560, "Семейство утверждений, равносильных гипотезе.", 4),
  n("rh-compute", "Вычислительная проверка", "experiment", "verification", 690, 640, "Проверка большого числа нулей на критической прямой.", 5),
  n("rh-spectral", "Спектральный подход", "direction", "open", 340, 610, "Поиск самосопряжённого оператора со спектром, связанным с нулями.", 2),
  n("rh-matrix", "Случайные матрицы", "method", "partial", 80, 500, "Статистическая модель локальных расстояний между нулями.", 4),
  n("rh-density", "Теоремы о плотности", "result", "partial", 40, 300, "Оценки количества нулей вне критической прямой.", 4),
  n("rh-barrier", "Нет глобального механизма", "barrier", "open", 430, 320, "Локальные оценки пока не объединяются в доказательство для всех нулей.", 3),
];

const riemannEdges = [
  e("rh", "rh-zeta", "rh-core", "part"), e("rh", "rh-cont", "rh-zeta", "refines"), e("rh", "rh-func", "rh-core", "supports"),
  e("rh", "rh-strip", "rh-core", "part"), e("rh", "rh-core", "rh-primes", "refines"), e("rh", "rh-equiv", "rh-core", "supports"),
  e("rh", "rh-compute", "rh-core", "supports"), e("rh", "rh-spectral", "rh-core", "depends"), e("rh", "rh-matrix", "rh-spectral", "uses"),
  e("rh", "rh-density", "rh-strip", "refines"), e("rh", "rh-barrier", "rh-core", "blocks"), e("rh", "rh-func", "rh-strip", "refines"),
];

const pnpNodes: AtlasNode[] = [
  n("pnp-core", "P против NP", "problem", "open", 600, 320, "Совпадают ли задачи с быстро проверяемыми и быстро вычисляемыми решениями?", 2, [demoPaper("p-pnp-1", "Карта барьеров P против NP")]),
  n("pnp-p", "Класс P", "result", "solved", 80, 80, "Задачи, решаемые детерминированным алгоритмом за полиномиальное время.", 5),
  n("pnp-np", "Класс NP", "subproblem", "solved", 400, 80, "Задачи с полиномиально проверяемым сертификатом.", 5),
  n("pnp-complete", "NP-полные задачи", "result", "solved", 760, 80, "Универсальные по сложности задачи внутри NP.", 5),
  n("pnp-co", "co-NP", "subproblem", "open", 1080, 80, "Класс дополнений задач из NP и вопрос его совпадения с NP.", 4),
  n("pnp-reductions", "Полиномиальные сведения", "method", "solved", 600, 210, "Инструмент переноса вычислительной сложности между задачами.", 5),
  n("pnp-rel", "Релятивизация", "barrier", "open", 130, 570, "Большой класс техник не способен разрешить проблему из-за оракульных миров.", 5),
  n("pnp-natural", "Естественные доказательства", "barrier", "open", 430, 570, "Барьер для комбинаторных нижних оценок при криптографических предположениях.", 5),
  n("pnp-algeb", "Алгебраизация", "barrier", "open", 760, 570, "Расширение барьера релятивизации на алгебраические методы.", 5),
  n("pnp-circuits", "Нижние оценки схем", "direction", "partial", 1040, 560, "Поиск ограничений размера булевых схем.", 3),
  n("pnp-geo", "Геометрическая сложность", "direction", "open", 1060, 340, "Алгебро-геометрическая программа отделения классов.", 2),
  n("pnp-sat", "SAT и 3-SAT", "experiment", "partial", 130, 330, "Канонические NP-полные задачи и полигон для алгоритмических границ.", 5),
];

const pnpEdges = [
  e("pnp", "pnp-p", "pnp-np", "part"), e("pnp", "pnp-np", "pnp-core", "part"), e("pnp", "pnp-complete", "pnp-core", "refines"),
  e("pnp", "pnp-co", "pnp-core", "depends"), e("pnp", "pnp-reductions", "pnp-complete", "uses"), e("pnp", "pnp-sat", "pnp-complete", "supports"),
  e("pnp", "pnp-rel", "pnp-core", "blocks"), e("pnp", "pnp-natural", "pnp-core", "blocks"), e("pnp", "pnp-algeb", "pnp-core", "blocks"),
  e("pnp", "pnp-circuits", "pnp-core", "depends"), e("pnp", "pnp-geo", "pnp-circuits", "alternative"), e("pnp", "pnp-natural", "pnp-circuits", "blocks"),
];

const agingNodes: AtlasNode[] = [
  n("age-core", "Механизмы старения", "problem", "open", 580, 410, "Как взаимодействующие повреждения и адаптации приводят к возрастному снижению функций?", 2, [demoPaper("p-age-1", "Уровни биологии старения")]),
  n("age-dna", "Геномная нестабильность", "subproblem", "partial", 80, 70, "Накопление мутаций и повреждений ДНК.", 4),
  n("age-telo", "Укорочение теломер", "result", "partial", 400, 55, "Сокращение защитных концов хромосом в делящихся клетках.", 4),
  n("age-epi", "Эпигенетические сдвиги", "subproblem", "partial", 760, 70, "Возрастные изменения метилирования и хроматина.", 4),
  n("age-protein", "Потеря протеостаза", "subproblem", "partial", 1080, 80, "Нарушение сворачивания, контроля и удаления белков.", 4),
  n("age-mito", "Митохондриальная дисфункция", "subproblem", "partial", 100, 360, "Сдвиги энергетического обмена и сигнальных функций митохондрий.", 4),
  n("age-sen", "Клеточная сенесценция", "subproblem", "partial", 1050, 360, "Остановка деления и провоспалительный секреторный фенотип.", 5),
  n("age-stem", "Истощение стволовых клеток", "subproblem", "open", 120, 650, "Снижение регенеративного резерва тканей.", 3),
  n("age-immune", "Иммунное старение", "subproblem", "partial", 410, 690, "Перестройка врождённого и адаптивного иммунитета.", 4),
  n("age-inflam", "Хроническое воспаление", "evidence", "partial", 750, 690, "Системный низкоинтенсивный воспалительный фон.", 4),
  n("age-system", "Межорганные сигналы", "question", "open", 1080, 650, "Какие ткани задают темп системного старения?", 2),
  n("age-intervention", "Комбинированные вмешательства", "direction", "verification", 585, 790, "Проверка сочетаний сенолитиков, метаболических и иммунных подходов.", 2),
];

const agingEdges = [
  e("age", "age-dna", "age-core", "part"), e("age", "age-telo", "age-core", "part"), e("age", "age-epi", "age-core", "part"),
  e("age", "age-protein", "age-core", "part"), e("age", "age-mito", "age-sen", "supports"), e("age", "age-sen", "age-inflam", "supports"),
  e("age", "age-stem", "age-core", "part"), e("age", "age-immune", "age-inflam", "supports"), e("age", "age-inflam", "age-system", "depends"),
  e("age", "age-system", "age-core", "refines"), e("age", "age-intervention", "age-sen", "uses"), e("age", "age-intervention", "age-immune", "uses"),
];

const resistanceNodes: AtlasNode[] = [
  n("ab-core", "Устойчивость к антибиотикам", "problem", "open", 580, 310, "Эволюция и распространение механизмов, снижающих эффективность антимикробной терапии.", 2, [demoPaper("p-ab-1", "Контуры антимикробной устойчивости")]),
  n("ab-target", "Модификация мишени", "subproblem", "partial", 90, 80, "Изменение клеточной структуры, на которую действует препарат.", 5),
  n("ab-enzyme", "Инактивация препарата", "subproblem", "partial", 90, 260, "Ферментативное разрушение или модификация антибиотика.", 5),
  n("ab-efflux", "Эффлюксные насосы", "subproblem", "partial", 90, 440, "Активное выведение препарата из бактериальной клетки.", 5),
  n("ab-biofilm", "Биоплёнки", "subproblem", "partial", 90, 620, "Сообщества клеток с пониженной доступностью и чувствительностью.", 4),
  n("ab-use", "Нерациональное применение", "barrier", "open", 1050, 70, "Селекционное давление в медицине, сельском хозяйстве и среде.", 5),
  n("ab-transfer", "Горизонтальный перенос генов", "method", "partial", 1050, 250, "Обмен мобильными генетическими элементами между бактериями.", 5),
  n("ab-surv", "Геномный надзор", "method", "partial", 1050, 430, "Отслеживание линий, генов устойчивости и вспышек.", 4),
  n("ab-fast", "Быстрая диагностика", "direction", "verification", 1050, 610, "Определение возбудителя и чувствительности до назначения терапии.", 4),
  n("ab-phage", "Фаговая терапия", "direction", "verification", 380, 730, "Использование бактериофагов как альтернативы или дополнения.", 3),
  n("ab-new", "Новые классы препаратов", "direction", "open", 760, 730, "Поиск молекул с новыми мишенями и механизмами действия.", 3),
  n("ab-steward", "Антимикробный stewardship", "evidence", "partial", 580, 530, "Системное управление назначениями и профилактикой передачи.", 5),
];

const resistanceEdges = [
  e("ab", "ab-target", "ab-core", "part"), e("ab", "ab-enzyme", "ab-core", "part"), e("ab", "ab-efflux", "ab-core", "part"),
  e("ab", "ab-biofilm", "ab-core", "part"), e("ab", "ab-use", "ab-core", "supports"), e("ab", "ab-transfer", "ab-core", "supports"),
  e("ab", "ab-surv", "ab-steward", "uses"), e("ab", "ab-fast", "ab-steward", "supports"), e("ab", "ab-steward", "ab-core", "contradicts"),
  e("ab", "ab-phage", "ab-new", "alternative"), e("ab", "ab-phage", "ab-core", "contradicts"), e("ab", "ab-new", "ab-core", "contradicts"),
];

const photoNodes: AtlasNode[] = [
  n("ph-core", "Искусственный фотосинтез", "problem", "open", 560, 340, "Преобразование солнечной энергии в устойчивое химическое топливо.", 2, [demoPaper("p-ph-1", "Цепочка искусственного фотосинтеза")]),
  n("ph-light", "Поглощение света", "subproblem", "partial", 40, 340, "Захват фотонов полупроводником или молекулярным сенсибилизатором.", 5),
  n("ph-charge", "Разделение заряда", "subproblem", "partial", 250, 340, "Создание долгоживущих электронно-дырочных пар.", 4),
  n("ph-transfer", "Перенос электронов", "subproblem", "partial", 820, 340, "Доставка зарядов к каталитическим центрам без рекомбинации.", 4),
  n("ph-water", "Окисление воды", "subproblem", "partial", 1060, 120, "Получение протонов, электронов и кислорода.", 4),
  n("ph-co2", "Восстановление CO₂", "subproblem", "partial", 1060, 560, "Формирование углеродсодержащих продуктов из углекислого газа.", 3),
  n("ph-oer", "Катализатор OER", "method", "verification", 820, 40, "Каталитический центр реакции выделения кислорода.", 4),
  n("ph-co-cat", "Катализатор CO₂RR", "method", "verification", 820, 650, "Управление скоростью и селективностью восстановления CO₂.", 3),
  n("ph-h2", "Водород", "result", "partial", 1320, 150, "Простейшее солнечное топливо для хранения энергии.", 5),
  n("ph-carbon", "Метанол и C₂-продукты", "direction", "open", 1320, 550, "Более энергоёмкие продукты со сложным контролем селективности.", 2),
  n("ph-stability", "Фотокоррозия", "barrier", "open", 550, 70, "Деградация светопоглощающего материала и интерфейсов.", 4),
  n("ph-device", "Интегрированная ячейка", "experiment", "verification", 550, 700, "Проверка полного цикла при реалистичном освещении и масштабе.", 3),
];

const photoEdges = [
  e("ph", "ph-light", "ph-charge", "depends"), e("ph", "ph-charge", "ph-core", "part"), e("ph", "ph-core", "ph-transfer", "depends"),
  e("ph", "ph-transfer", "ph-water", "depends"), e("ph", "ph-transfer", "ph-co2", "depends"), e("ph", "ph-oer", "ph-water", "uses"),
  e("ph", "ph-co-cat", "ph-co2", "uses"), e("ph", "ph-water", "ph-h2", "supports"), e("ph", "ph-co2", "ph-carbon", "supports"),
  e("ph", "ph-stability", "ph-core", "blocks"), e("ph", "ph-device", "ph-core", "supports"), e("ph", "ph-stability", "ph-device", "blocks"),
];

const nitrogenNodes: AtlasNode[] = [
  n("nf-core", "Каталитическая фиксация азота", "problem", "open", 570, 330, "Снижение энергетической цены превращения N₂ в доступные азотные соединения.", 2, [demoPaper("p-nf-1", "Маршруты фиксации азота")]),
  n("nf-n2", "Активация связи N≡N", "subproblem", "open", 60, 320, "Ослабление одной из наиболее прочных химических связей.", 3),
  n("nf-hb", "Процесс Габера — Боша", "result", "solved", 320, 80, "Промышленный высокотемпературный и высокобарный синтез аммиака.", 5),
  n("nf-iron", "Железные катализаторы", "method", "solved", 690, 60, "Промышленные поверхности диссоциации азота.", 5),
  n("nf-ruth", "Рутениевые катализаторы", "method", "partial", 1050, 80, "Активные системы с ограничениями стоимости и стабильности.", 4),
  n("nf-energy", "Энергия и давление", "barrier", "open", 1060, 330, "Высокие энергозатраты и углеродный след водорода.", 5),
  n("nf-bio", "Нитрогеназа", "evidence", "partial", 1050, 620, "Биологический пример фиксации в мягких условиях.", 5),
  n("nf-electro", "Электрокатализ", "direction", "verification", 700, 680, "Восстановление азота с использованием электрической энергии.", 2),
  n("nf-photo", "Фотокатализ", "direction", "verification", 330, 680, "Связывание активации N₂ с поглощением света.", 2),
  n("nf-lithium", "Литий-опосредованный путь", "experiment", "partial", 40, 620, "Непрямой электрохимический маршрут через активированный литий.", 3),
  n("nf-her", "Конкуренция выделения H₂", "barrier", "open", 570, 520, "Побочная реакция снижает селективность синтеза аммиака.", 4),
  n("nf-measure", "Надёжная верификация NH₃", "method", "verification", 570, 190, "Изотопный контроль и исключение фонового загрязнения.", 5),
];

const nitrogenEdges = [
  e("nf", "nf-n2", "nf-core", "part"), e("nf", "nf-hb", "nf-core", "supports"), e("nf", "nf-iron", "nf-hb", "uses"),
  e("nf", "nf-ruth", "nf-hb", "alternative"), e("nf", "nf-energy", "nf-hb", "blocks"), e("nf", "nf-bio", "nf-core", "supports"),
  e("nf", "nf-electro", "nf-hb", "alternative"), e("nf", "nf-photo", "nf-hb", "alternative"), e("nf", "nf-lithium", "nf-electro", "refines"),
  e("nf", "nf-her", "nf-electro", "blocks"), e("nf", "nf-measure", "nf-electro", "uses"), e("nf", "nf-measure", "nf-photo", "uses"),
];

export const problems: ScientificProblem[] = [
  { slug: "riemann-hypothesis", discipline: "mathematics", title: "Гипотеза Римана", kicker: "Теория чисел · 1859 — настоящее время", summary: "Критическая прямая, нули дзета-функции и скрытый порядок простых чисел.", description: "Центральная карта связывает аналитические, вычислительные и спектральные подходы к одной из главных открытых проблем математики.", progress: 37, popularity: 99, activity: 78, openShare: 42, tags: ["Простые числа", "Комплексный анализ", "Спектры"], composition: "radial", nodes: riemannNodes, edges: riemannEdges },
  { slug: "p-versus-np", discipline: "mathematics", title: "P против NP", kicker: "Теория сложности · 1971 — настоящее время", summary: "Граница между быстрым вычислением и быстрой проверкой.", description: "Многослойная карта классов сложности, редукций, доказательных барьеров и современных направлений атаки.", progress: 24, popularity: 96, activity: 86, openShare: 51, tags: ["Алгоритмы", "Сложность", "Криптография"], composition: "layers", nodes: pnpNodes, edges: pnpEdges },
  { slug: "mechanisms-of-aging", discipline: "biology", title: "Механизмы старения", kicker: "Системная биология · многоуровневая проблема", summary: "От повреждений ДНК до межорганных сигналов и потери устойчивости системы.", description: "Сетевая карта показывает, как молекулярные, клеточные и системные процессы усиливают друг друга.", progress: 43, popularity: 93, activity: 94, openShare: 39, tags: ["Геронтология", "Клетка", "Системы"], composition: "network", nodes: agingNodes, edges: agingEdges },
  { slug: "antibiotic-resistance", discipline: "biology", title: "Устойчивость к антибиотикам", kicker: "Микробиология · глобальная угроза", summary: "Механизмы резистентности, давление отбора, диагностика и терапевтические ответы.", description: "Карта связывает биологические механизмы с внешними факторами и стратегиями контроля.", progress: 48, popularity: 95, activity: 98, openShare: 35, tags: ["Бактерии", "Эволюция", "Терапия"], composition: "bipolar", nodes: resistanceNodes, edges: resistanceEdges },
  { slug: "artificial-photosynthesis", discipline: "chemistry", title: "Искусственный фотосинтез", kicker: "Фотохимия · энергия из света", summary: "Цепочка от поглощения фотона до водорода и углеродных топлив.", description: "Процессная карта делает видимыми потери, катализаторы и развилки химического преобразования энергии.", progress: 41, popularity: 89, activity: 91, openShare: 38, tags: ["Солнечное топливо", "CO₂", "Катализ"], composition: "process", nodes: photoNodes, edges: photoEdges },
  { slug: "nitrogen-fixation", discipline: "chemistry", title: "Каталитическая фиксация азота", kicker: "Катализ · альтернатива высокому давлению", summary: "Активация N₂, селективность и поиск мягких маршрутов синтеза аммиака.", description: "Карта сопоставляет промышленный процесс, биологический механизм и экспериментальные альтернативы.", progress: 32, popularity: 84, activity: 96, openShare: 45, tags: ["Аммиак", "Электрокатализ", "Азот"], composition: "orbital", nodes: nitrogenNodes, edges: nitrogenEdges },
];

export function getDiscipline(slug: string) {
  return disciplines.find((discipline) => discipline.slug === slug);
}

export function getProblem(slug: string) {
  return problems.find((problem) => problem.slug === slug);
}

export function getProblemsByDiscipline(slug: string) {
  return problems.filter((problem) => problem.discipline === slug);
}
