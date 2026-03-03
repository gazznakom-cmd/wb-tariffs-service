# WB Tariffs Service

Сервис для автоматического получения тарифов Wildberries и синхронизации их с Google Таблицами.

> 📖 **Быстрый старт**: См. [QUICKSTART.md](QUICKSTART.md) для запуска за 5 минут

## Описание

Сервис выполняет две задачи:

1. **Получение тарифов WB**: Каждый час получает актуальные тарифы для коробов через API Wildberries и сохраняет их в PostgreSQL
2. **Обновление Google Таблиц**: Каждые 30 минут обновляет данные в указанных Google таблицах (лист `stocks_coefs`)

## Технологии

- Node.js 20 + TypeScript
- PostgreSQL 16.1
- Knex.js (миграции и работа с БД)
- Google Sheets API
- node-cron (планировщик задач)
- Docker & Docker Compose

## Быстрый старт

### 1. Клонировать репозиторий

```bash
git clone <repository-url>
cd wb-tariffs-service
```

### 2. Настроить переменные окружения

Создайте файл `.env` на основе `example.env`:

```bash
cp example.env .env
```

Отредактируйте `.env` и укажите:
- `WB_API_TOKEN` - ваш токен WB API
- `GOOGLE_SHEET_IDS` - ID ваших Google таблиц через запятую
- `GOOGLE_CREDENTIALS_PATH` - путь к файлу credentials.json

### 3. Настроить Google Sheets API

#### 3.1. Создать Service Account

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект
3. Включите Google Sheets API
4. Создайте Service Account:
   - IAM & Admin → Service Accounts → Create Service Account
   - Создайте ключ (JSON) и скачайте его
5. Сохраните скачанный JSON как `credentials.json` в корне проекта

#### 3.2. Настроить Google Таблицы

1. Создайте Google таблицу (или несколько)
2. В каждой таблице создайте лист с названием `stocks_coefs`
3. Откройте таблицу → Поделиться
4. Добавьте email Service Account (из credentials.json, поле `client_email`)
5. Дайте права "Редактор"
6. Скопируйте ID таблицы из URL:
   ```
   https://docs.google.com/spreadsheets/d/[ЭТО_ID_ТАБЛИЦЫ]/edit
   ```
7. Добавьте ID в `.env`:
   ```
   GOOGLE_SHEET_IDS=1abc...xyz,2def...uvw
   ```

### 4. Запустить сервис

```bash
docker compose up --build
```

Сервис автоматически:
- Запустит PostgreSQL
- Выполнит миграции БД
- Загрузит первоначальные данные
- Запустит планировщики задач

## Структура данных

### Таблица `wb_tariffs` (PostgreSQL)

Хранит исторические данные о тарифах по дням:

- `warehouse_name` - название склада
- `geo_name` - географическое расположение
- `box_delivery_base` - базовая стоимость доставки короба
- `box_delivery_liter` - стоимость доставки за литр
- `box_delivery_coef` - коэффициент доставки
- `box_storage_base` - базовая стоимость хранения
- `box_storage_liter` - стоимость хранения за литр
- `box_storage_coef` - коэффициент хранения
- `tariff_date` - дата тарифа

Уникальный ключ: `(warehouse_name, tariff_date)` - данные за день обновляются при повторном получении.

### Google Таблицы (лист stocks_coefs)

Три колонки:
- Склад
- Коэффициент (box_storage_coef)
- Дата

Данные отсортированы по возрастанию коэффициента.

## Планировщики

- **Получение тарифов WB**: каждый час (в начале часа)
- **Обновление Google Таблиц**: каждые 30 минут

При первом запуске выполняется немедленная загрузка данных.

## Проверка работы

### Логи

Сервис выводит логи о выполнении задач:

```
🚀 Starting WB Tariffs Service...
✓ Database migrations completed
[Fetch Tariffs] Starting...
[Fetch Tariffs] ✓ Saved 50 tariffs for 2026-03-03
[Update Sheets] Starting...
✓ Updated sheet: 1abc...xyz
[Update Sheets] ✓ Updated 50 rows in all sheets
✓ Initial data fetch completed
✓ Schedulers started:
  - Fetch WB tariffs: every hour
  - Update Google Sheets: every 30 minutes

📊 Service is running...
```

### Проверка БД

```bash
# Подключиться к PostgreSQL
docker compose exec postgres psql -U postgres -d postgres

# Посмотреть данные
SELECT * FROM wb_tariffs ORDER BY tariff_date DESC LIMIT 10;

# Статистика
SELECT tariff_date, COUNT(*) as warehouses_count 
FROM wb_tariffs 
GROUP BY tariff_date 
ORDER BY tariff_date DESC;
```

### Проверка Google Таблиц

Откройте ваши Google таблицы - через 1-2 минуты после запуска там появятся данные с тарифами, отсортированные по коэффициенту.

## Остановка сервиса

```bash
docker compose down
```

Для полной очистки (включая данные БД):

```bash
docker compose down --volumes
```

## Структура проекта

```
.
├── src/
│   ├── app.ts                      # Точка входа
│   ├── config/
│   │   ├── env/env.ts              # Конфигурация окружения
│   │   └── knex/knexfile.ts        # Конфигурация Knex
│   ├── services/
│   │   ├── wb-api.service.ts       # Клиент WB API
│   │   └── google-sheets.service.ts # Клиент Google Sheets
│   ├── repositories/
│   │   └── tariffs.repository.ts   # Работа с БД
│   ├── jobs/
│   │   ├── fetch-tariffs.job.ts    # Задача получения тарифов
│   │   └── update-sheets.job.ts    # Задача обновления таблиц
│   ├── types/
│   │   └── tariffs.types.ts        # TypeScript типы
│   └── postgres/
│       ├── knex.ts                 # Инициализация Knex
│       └── migrations/             # Миграции БД
├── docker-compose.yaml
├── Dockerfile
├── example.env                     # Пример конфигурации
├── credentials.example.json        # Пример credentials
└── README.md
```

## Troubleshooting

### Ошибка подключения к Google Sheets

- Проверьте, что `credentials.json` существует и содержит валидные данные
- Убедитесь, что Service Account имеет доступ к таблицам
- Проверьте, что в таблицах есть лист `stocks_coefs`

### Ошибка WB API

- Проверьте валидность токена в `.env`
- Убедитесь, что токен не истек

### Ошибка подключения к БД

- Убедитесь, что PostgreSQL запустился: `docker compose ps`
- Проверьте переменные окружения в `.env`

## API Wildberries

Используется endpoint: `https://common-api.wildberries.ru/api/v1/tariffs/box`

Документация: https://dev.wildberries.ru/en/openapi/wb-tariffs

## Лицензия

ISC
