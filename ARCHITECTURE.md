# Архитектура

## Подход

Проект — модульный монолит на Next.js App Router. UI, доменная логика, данные и инфраструктура разделены, но деплоятся единым приложением. Это снижает стоимость MVP и оставляет чёткие швы для будущего выделения ingestion, ML, уведомлений и рецензирования.

```text
src/app                 маршруты, layout, composition root
src/components          UI и составные продуктовые поверхности
src/domains/atlas       типы и чистая логика научных карт
src/domains/auth        схемы и состояние авторизации
src/domains/user        закладки, история, профиль (demo adapter)
src/data                локальный read-only atlas repository
src/lib                 Supabase, rate limit, общие функции
supabase/migrations     PostgreSQL schema + RLS
supabase/seed.sql       содержательные демонстрационные данные
```

## Домены

- `authentication`: Supabase Auth и локальная, явно маркированная demo-session.
- `profiles`: профиль, специализация, интересы и расширяемая роль.
- `disciplines` / `scientific problems`: каталог и агрегированные метрики.
- `graph data`: независимые конфигурации узлов/рёбер; добавление карты не требует изменения renderer.
- `graph visualization`: React Flow, фильтры, viewport, inspector.
- `papers`: публикации и роль статьи относительно конкретной вершины.
- `bookmarks` / `user activity`: локальный adapter сейчас, RLS-таблицы для production.
- `publications`: научная стена, типизированные записи, задел под версии.
- `expert reviews`, `notifications`, `administration`: схема и RLS готовы; продуктовые поверхности следующей фазы.

## Поток данных

Публичная карта получает `ScientificProblem` из репозитория. Renderer преобразует доменные `AtlasNode`/`AtlasEdge` в React Flow nodes/edges только на границе UI. Фильтрация остаётся чистой функцией и тестируется отдельно. Inspector работает с доменной моделью, поэтому может использовать и local seeds, и ответ Supabase без переписывания.

В demo mode Zustand persist хранит только пользовательские действия текущего браузера. При наличии env Supabase Auth становится источником сессии. Следующий production-шаг — реализовать `BookmarksRepository`, `ActivityRepository` и `PublicationsRepository` с двумя adapters (`local`, `supabase`), сохранив UI неизменным.

## Безопасность

- секреты не попадают в client bundle;
- browser использует только anon key;
- RLS проверяет `auth.uid()` для приватных данных;
- экспертная вставка проверяет серверную роль в `profiles`;
- публичная выдача графов ограничена `is_published`;
- формы валидируются Zod; server actions должны повторять проверку;
- optional Upstash limiter fail-open только для доступности прототипа; production-формы должны выбирать fail-closed для критических операций.

## Расширение

Ingestion из внешних источников может писать нормализованные papers/node_papers через очередь. ML строит кандидаты карт как отдельные версии, которые эксперт принимает в основной граф. Версионирование добавляется таблицами `graph_versions`, `node_revisions`, `edge_revisions`, не меняя стабильные идентификаторы сущностей. API/MCP читают те же доменные DTO и политики доступа.
