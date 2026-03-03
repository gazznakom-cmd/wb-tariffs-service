# Быстрый старт (5 минут)

## Предварительные требования

- Docker Desktop установлен и запущен
- Node.js 20+ (для локальной разработки, опционально)
- Google Cloud Service Account с доступом к Google Sheets API

## Шаг 1: Клонировать репозиторий

```bash
git clone <repository-url>
cd wb-tariffs-service
```

## Шаг 2: Настроить переменные окружения

```bash
# Скопировать пример
cp example.env .env

# Отредактировать .env
# Заменить:
# - WB_API_TOKEN на ваш токен
# - GOOGLE_SHEET_IDS на ID ваших таблиц (через запятую)
```

## Шаг 3: Добавить Google credentials

Скачайте JSON ключ Service Account и сохраните как `credentials.json` в корне проекта.

## Шаг 4: Настроить Google Таблицы

1. Создайте Google таблицу
2. Добавьте лист с названием `stocks_coefs`
3. Поделитесь таблицей с email из `credentials.json` (поле `client_email`)
4. Дайте права "Редактор"
5. Скопируйте ID таблицы из URL и добавьте в `.env`

## Шаг 5: Запустить сервис

```bash
docker compose up --build
```

## Проверка работы

Через 1-2 минуты после запуска:

1. Откройте вашу Google таблицу
2. На листе `stocks_coefs` должны появиться данные
3. Данные отсортированы по коэффициенту (от меньшего к большему)

## Логи

Вы должны увидеть:

```
✓ Database migrations completed
[Fetch Tariffs] ✓ Saved 81 tariffs for 2026-03-03
✓ Updated sheet: [your-sheet-id]
[Update Sheets] ✓ Updated 81 rows in all sheets
✓ Initial data fetch completed
✓ Schedulers started:
  - Fetch WB tariffs: every hour
  - Update Google Sheets: every 30 minutes

📊 Service is running...
```

## Остановка

```bash
docker compose down
```

## Полная очистка (включая данные БД)

```bash
docker compose down --volumes
```

## Troubleshooting

### Ошибка "credentials.json not found"

Убедитесь, что файл `credentials.json` находится в корне проекта.

### Ошибка "Permission denied" в Google Sheets

Проверьте, что Service Account имеет доступ к таблице (email из `client_email`).

### Ошибка "WB API error: 401"

Проверьте токен в `.env` файле.

### Docker не запускается

Убедитесь, что Docker Desktop запущен.

## Дополнительная информация

Полная документация: [README.md](README.md)
