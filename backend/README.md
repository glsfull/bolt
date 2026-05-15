# Backend

Backend-слой новой реализации вынесен из клиентского прототипа в отдельную
папку. Он отвечает за Supabase-схему, Edge Functions, AI/OCR-интеграции,
очереди обработки медицинских файлов и генерацию отчетов.

## Границы функций

- `supabase/functions/process-analysis`: создает задачу обработки анализа,
  меняет статусы `uploaded`, `ocr_processing`, `ai_processing`, `completed`,
  `failed`.
- `supabase/functions/run-ocr`: запускает OCR для PDF/изображений из приватного
  Storage и возвращает структурированный текст.
- `supabase/functions/generate-doctor-report`: формирует PDF-отчет и добавляет
  медицинский отказ от ответственности.
- `supabase/functions/symptom-checker`: выполняет AI-анализ симптомов только на
  backend-стороне.
- `supabase/functions/risk-assessment`: рассчитывает риски на основе профиля и
  истории анализов.
- `supabase/functions/admin-settings`: управляет AI/OCR-провайдерами, лимитами
  и feature flags для роли `admin`.

Секреты AI/OCR не должны попадать в мобильный клиент. Все пользовательские
медицинские данные должны быть закрыты RLS-политиками и приватным Storage.
