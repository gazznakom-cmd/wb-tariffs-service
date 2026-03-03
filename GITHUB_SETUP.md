# Публикация проекта на GitHub

## Шаг 1: Инициализация Git репозитория

```bash
# Инициализировать репозиторий
git init

# Добавить все файлы
git add .

# Первый коммит
git commit -m "Initial commit: WB Tariffs Service v1.0.0"
```

## Шаг 2: Создание репозитория на GitHub

1. Перейдите на [GitHub](https://github.com/)
2. Нажмите "New repository"
3. Заполните форму:
   - Repository name: `wb-tariffs-service`
   - Description: `Сервис для автоматического получения тарифов Wildberries и синхронизации с Google Sheets`
   - Visibility: Public или Private
   - НЕ добавляйте README, .gitignore, license (они уже есть)
4. Нажмите "Create repository"

## Шаг 3: Подключение к GitHub

```bash
# Добавить remote
git remote add origin https://github.com/ваш-username/wb-tariffs-service.git

# Или через SSH
git remote add origin git@github.com:ваш-username/wb-tariffs-service.git

# Отправить код
git branch -M main
git push -u origin main
```

## Шаг 4: Настройка репозитория

### Добавить описание

В настройках репозитория (Settings) добавьте:

**Description:**
```
Автоматизированный сервис для получения тарифов Wildberries и синхронизации с Google Sheets. Node.js + TypeScript + PostgreSQL + Docker.
```

**Topics (теги):**
```
wildberries, google-sheets, nodejs, typescript, postgresql, docker, knex, automation, tariffs, api-integration
```

### Настроить About

- Website: (если есть)
- Topics: добавьте теги выше
- Include in the home page: ✓

## Шаг 5: Создать Release

```bash
# Создать тег
git tag -a v1.0.0 -m "Release v1.0.0: Initial release"

# Отправить тег
git push origin v1.0.0
```

На GitHub:
1. Перейдите в "Releases"
2. Нажмите "Create a new release"
3. Выберите тег v1.0.0
4. Заполните:
   - Release title: `v1.0.0 - Initial Release`
   - Description: скопируйте из CHANGELOG.md
5. Нажмите "Publish release"

## Шаг 6: Добавить GitHub Actions (опционально)

Создайте `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16.1-alpine
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: TypeScript check
      run: npm run tsc:check
    
    - name: Build
      run: npm run build
```

## Шаг 7: Добавить badges в README

Добавьте в начало README.md:

```markdown
# WB Tariffs Service

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.1-blue)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-ready-blue)](https://www.docker.com/)
```

## Шаг 8: Создать .github/ISSUE_TEMPLATE (опционально)

### Bug Report (.github/ISSUE_TEMPLATE/bug_report.md)

```markdown
---
name: Bug report
about: Сообщить о проблеме
title: '[BUG] '
labels: bug
assignees: ''
---

**Описание проблемы**
Четкое описание проблемы.

**Как воспроизвести**
Шаги для воспроизведения:
1. ...
2. ...

**Ожидаемое поведение**
Что должно было произойти.

**Скриншоты**
Если применимо, добавьте скриншоты.

**Окружение:**
 - OS: [e.g. Ubuntu 22.04]
 - Node.js: [e.g. 20.0.0]
 - Docker: [e.g. 24.0.0]

**Дополнительный контекст**
Любая дополнительная информация.
```

### Feature Request (.github/ISSUE_TEMPLATE/feature_request.md)

```markdown
---
name: Feature request
about: Предложить новую функцию
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

**Описание функции**
Четкое описание желаемой функции.

**Зачем это нужно**
Объяснение проблемы, которую решает функция.

**Предлагаемое решение**
Как вы видите реализацию.

**Альтернативы**
Альтернативные решения, которые вы рассматривали.

**Дополнительный контекст**
Любая дополнительная информация.
```

## Шаг 9: Добавить CONTRIBUTING.md (опционально)

```markdown
# Contributing to WB Tariffs Service

Спасибо за интерес к проекту!

## Как внести вклад

1. Fork репозитория
2. Создайте ветку для вашей функции (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## Стандарты кода

- Используйте TypeScript
- Следуйте существующему стилю кода
- Добавляйте комментарии для сложной логики
- Обновляйте документацию при необходимости

## Тестирование

Перед отправкой PR убедитесь, что:
- `npm run tsc:check` проходит без ошибок
- `npm run build` успешно собирает проект
- Тесты работают: `npm run test:wb-api` и `npm run test:google-sheets`

## Отчеты об ошибках

Используйте GitHub Issues с шаблоном Bug Report.

## Предложения функций

Используйте GitHub Issues с шаблоном Feature Request.
```

## Шаг 10: Проверка перед публикацией

Убедитесь, что:

- ✅ `.env` и `credentials.json` в .gitignore
- ✅ Нет чувствительных данных в коде
- ✅ README.md содержит полную инструкцию
- ✅ LICENSE файл присутствует
- ✅ Все ссылки в документации работают
- ✅ Примеры конфигурации актуальны

## Шаг 11: Продвижение

После публикации:

1. Поделитесь в социальных сетях
2. Добавьте в awesome-списки (если есть подходящие)
3. Напишите статью на Habr/Medium
4. Добавьте в свое портфолио

## Структура коммитов

Рекомендуемый формат:

```
<type>: <subject>

<body>

<footer>
```

Типы:
- `feat`: новая функция
- `fix`: исправление бага
- `docs`: изменения в документации
- `style`: форматирование кода
- `refactor`: рефакторинг
- `test`: добавление тестов
- `chore`: обновление зависимостей и т.д.

Примеры:

```bash
git commit -m "feat: add support for pallet tariffs"
git commit -m "fix: handle empty warehouse list"
git commit -m "docs: update Google Sheets setup guide"
```

## Полезные команды

```bash
# Проверить статус
git status

# Посмотреть изменения
git diff

# Отменить изменения
git checkout -- filename

# Создать новую ветку
git checkout -b feature-name

# Переключиться на main
git checkout main

# Обновить из remote
git pull origin main

# Посмотреть историю
git log --oneline

# Создать тег
git tag -a v1.0.1 -m "Version 1.0.1"
git push origin v1.0.1
```

## Готово!

Ваш проект теперь на GitHub и готов к использованию сообществом! 🎉

Не забудьте:
- Отвечать на Issues
- Рассматривать Pull Requests
- Обновлять документацию
- Выпускать новые версии
