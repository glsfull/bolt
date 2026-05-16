# Мобильное приложение

Эта папка содержит каркас новой production-реализации на Expo, React Native,
TypeScript и Expo Router. Прототип в `project/` остается неизменяемым эталоном:
маршруты, темы и будущие экраны здесь ссылаются на исходные файлы и HTML-снимки.

## Этап 1

- `app/` задает Expo Router маршруты для утвержденной карты экранов.
- `src/navigation/routes.ts` хранит единый контракт маршрутов и нижней навигации.
- `src/theme/` хранит дизайн-токены, перенесенные из инвентаризации.
- `src/screens/ScreenPlaceholder.tsx` временно показывает каркасные экраны и
  медицинский disclaimer там, где он обязателен.

Перед переносом каждого экрана нужно сверять его с эталоном из `project/` и не
дублировать базовые цвета, радиусы, размеры и отступы вне `src/theme`.

## Этап 3

- `src/services/supabase/readLayer.ts` подключает read layer для профиля,
  истории анализов, программ, последних предупреждений и расшифровки анализа.
  Если `EXPO_PUBLIC_SUPABASE_URL` и `EXPO_PUBLIC_SUPABASE_ANON_KEY` не заданы,
  приложение возвращает demo fixtures из `src/features/demoData.ts`.
- `app/analysis/result/[id].tsx` перенесен с карточками показателей,
  категориями, статусами `low`, `normal`, `high`, `critical` и шкалой
  референсов.
- `app/analysis/upload.tsx` и `app/analysis/camera.tsx` фиксируют клиентский
  контракт загрузки, OCR и AI-обработки через backend job statuses
  `uploaded`, `ocr_processing`, `ai_processing`, `completed` в `analysis_jobs`.
- Экраны рисков и отчета для врача показывают обязательный медицинский
  disclaimer.

### Screenshot review

Попытка запуска Expo web для screenshot review:

```bash
npm run web -- --port 8081
```

Текущий пакет не содержит web-зависимостей Expo и останавливается с требованием
установить `react-native-web@~0.19.10` и `react-dom@18.2.0`. После добавления
этих зависимостей нужно открыть пять основных вкладок Expo web или device
preview и сохранить результаты в документации PR.
