# Version History

## v1.0.0 (2026-03-03)

### Initial Release

Первая стабильная версия сервиса для получения тарифов Wildberries и синхронизации с Google Sheets.

#### Features

- ✅ Автоматическое получение тарифов WB каждый час
- ✅ Синхронизация с Google Sheets каждые 30 минут
- ✅ PostgreSQL для хранения исторических данных
- ✅ Upsert логика для обновления данных за день
- ✅ Docker Compose для простого развертывания
- ✅ TypeScript для типобезопасности
- ✅ Knex.js для миграций и работы с БД
- ✅ Сортировка данных по коэффициенту хранения

#### Technical Stack

- Node.js 20
- TypeScript 5.7
- PostgreSQL 16.1
- Knex.js 3.0
- Google Sheets API v4
- node-cron 3.0
- Docker & Docker Compose

#### Database Schema

Таблица `wb_tariffs`:
- Уникальный индекс на (warehouse_name, tariff_date)
- Автоматические timestamps
- Индекс на tariff_date для быстрого поиска

#### API Integration

- WB API: `https://common-api.wildberries.ru/api/v1/tariffs/box`
- Google Sheets API v4 с Service Account аутентификацией

#### Deployment

- Multi-stage Dockerfile для оптимизации размера образа
- Docker Compose с health checks
- Автоматический запуск миграций при старте
- Volumes для персистентности данных

#### Documentation

- Полная инструкция в README.md
- Быстрый старт в QUICKSTART.md
- Гайд по публикации на GitHub в GITHUB_SETUP.md
- Примеры конфигурации (example.env, credentials.example.json)

#### Testing

- ✅ TypeScript компиляция без ошибок
- ✅ WB API протестирован (81 склад)
- ✅ Все зависимости установлены
- ✅ Docker build успешен

---

## Roadmap

### v1.1.0 (Planned)

- [ ] Поддержка тарифов для паллет
- [ ] Web интерфейс для мониторинга
- [ ] Уведомления при изменении тарифов
- [ ] Экспорт в Excel
- [ ] API для получения данных

### v1.2.0 (Planned)

- [ ] Графики изменения тарифов
- [ ] Сравнение тарифов между складами
- [ ] Прогнозирование изменений
- [ ] Telegram бот для уведомлений

---

## Changelog Format

Формат версий: MAJOR.MINOR.PATCH

- **MAJOR**: Несовместимые изменения API
- **MINOR**: Новая функциональность (обратно совместимая)
- **PATCH**: Исправления багов

Типы изменений:
- `Added` - новая функциональность
- `Changed` - изменения в существующей функциональности
- `Deprecated` - функциональность, которая будет удалена
- `Removed` - удаленная функциональность
- `Fixed` - исправления багов
- `Security` - исправления уязвимостей
