# Pathwise — MVP платформы глубокой профориентации

## Стек
| Слой | Технология | Зачем |
|---|---|---|
| Фреймворк | **Next.js 15 (App Router) + React 19 + TypeScript** | SSG-страницы для каждого языка → мгновенная загрузка; API в том же проекте |
| Стили | **Tailwind CSS v4** | Минимальный CSS, тёмная тема по системной настройке |
| Анимации | **Framer Motion** (`LazyMotion` + `m.*`) | Плавные переходы; грузится ~15 kb вместо ~34 kb; только GPU-свойства (transform/opacity) |
| i18n | **next-intl** | RU / KK / EN, URL вида `/kk/test`, автоопределение языка |
| Состояние | **Zustand + persist** | Прогресс теста сохраняется в localStorage — перезагрузка не теряет ответы |
| AI | **Claude API** (`@anthropic-ai/sdk`, модель `claude-opus-5-5`) | Structured outputs: ответ всегда валидный JSON по Zod-схеме |
| БД | **PostgreSQL + Prisma** | Пользователи, вопросы с переводами, попытки, результаты |

## Запуск
```bash
npm install
cp .env.example .env.local   # вставьте ANTHROPIC_API_KEY (без ключа — демо-режим)
npm run dev                  # http://localhost:3000
```
БД необязательна. Чтобы включить сохранение результатов, задайте `DATABASE_URL` и выполните `npx prisma migrate dev --name init`.

## Структура
```
prisma/schema.prisma            схема БД
src/
  middleware.ts                 определение языка, редирект / → /ru
  i18n/                         routing.ts · request.ts · navigation.ts
  messages/                     ru.json · kk.json · en.json — тексты интерфейса
  app/
    [locale]/layout.tsx         шапка, шрифт (с казахской кириллицей), провайдеры
    [locale]/page.tsx           лендинг + выбор категории
    [locale]/test/page.tsx      опрос
    [locale]/result/page.tsx    отчёт
    api/analyze/route.ts        POST: ответы → Claude → JSON-отчёт
  components/
    LanguageSwitcher.tsx        переключатель языков
    CategoryPicker.tsx          школьник / студент / взрослый
    quiz/                       Quiz · QuestionViews (шкала, карточки, текст) · ProgressBar · Analyzing
    report/Report.tsx           Match Score, сильные стороны, навыки, roadmap
  lib/
    questions.ts                банк вопросов (по структуре повторяет таблицы БД)
    ai/schema.ts                Zod-схема отчёта = контракт AI ↔ UI
    ai/prompt.ts                системный промпт + сборка ответов, учёт категории
    ai/client.ts                вызов Claude
    ai/mock.ts                  демо-отчёт без ключа
    db.ts                       Prisma + сохранение результата
  store/quiz.ts                 состояние теста
```

## Как добавить…
- **вопрос:** допишите объект в `src/lib/questions.ts` (тексты на 3 языках, `categories` — для кого он).
- **язык:** добавьте код в `src/i18n/routing.ts`, создайте `src/messages/<код>.json`, переводы в вопросах и `LANGUAGE_NAME` в `prompt.ts`.
- **поле в отчёте:** добавьте его в `src/lib/ai/schema.ts`; AI начнёт его заполнять, а TypeScript подскажет, где его показать.
