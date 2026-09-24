# Статистика активности

Инструмент для сбора статистики активности пользователей и тем форума за выбранный период.

## Файлы

- `stats.html` — HTML-структура и интерфейс статистики
- `stats.css` — стили интерфейса, включая светлую и тёмную темы
- `stats.js` — логика подсчёта статистики и работа с API

## Возможности

- Выбор произвольного периода для подсчёта статистики.
- Автоматическая установка периода по умолчанию: от 7 дней до вчерашнего дня.
- Получение пользователей из заданных групп.
- Подсчёт количества сообщений пользователей.
- Подсчёт общего количества символов в сообщениях пользователей.
- Определение наиболее активных тем по количеству сообщений.
- Отображение топ-30 пользователей и тем для каждой статистики.
- Поддержка светлой и тёмной темы.
- Отображение прогресса и текущего этапа подсчёта.
- Получение данных через API форума.
- Задержка между API-запросами для снижения нагрузки.

## Конфигурация

Основные настройки находятся в `stats.js`:

```javascript
const CONFIG = {
    excludeForums: window.PR_FORUMS,
    charCountForums: window.P
```

# Activity Statistics

A forum activity statistics tool that calculates user and topic activity for a selected date range.

## Files

- `stats.html` — HTML structure and interface
- `stats.css` — styles for the statistics interface, including light and dark themes
- `stats.js` — statistics calculation logic and API requests

## Features

- Select a custom date range for statistics.
- Default date range is set from 7 days before yesterday to yesterday.
- Fetches users from configured user groups.
- Counts the number of posts made by target users.
- Counts the total number of characters written by target users.
- Identifies the most active topics based on the number of posts.
- Displays the top 30 users and topics for each statistic.
- Supports light and dark themes.
- Displays a progress bar and current calculation status while processing.
- Uses the forum API to retrieve users, forums, topics, and posts.
- Includes a configurable delay between API requests to reduce request load.

## Configuration

The main configuration is located in `stats.js`:

```javascript
const CONFIG = {
  excludeForums: window.PR_FORUMS,
  charCountForums: window.PLAY_FORUMS,
  targetGroups: [1, 2, 5],
  topLimit: 30,
  maxTopics: 100,
  requestDelay: 500,
};
```

### Configuration options

- `excludeForums` — forum IDs excluded from post statistics.
- `charCountForums` — forum IDs used for character and topic activity statistics.
- `targetGroups` — user group IDs whose members are included in the statistics.
- `topLimit` — maximum number of users/topics displayed in each ranking.
- `maxTopics` — maximum number of topics processed per forum query.
- `requestDelay` — delay between API requests in milliseconds.

## Required Global Variables

The script expects the following global variables to be available:

```javascript
window.PR_FORUMS;
window.PLAY_FORUMS;
```

Both variables should contain arrays of forum IDs.

## API Methods

The script uses the following API methods:

- `users.get` — retrieves users from the configured groups.
- `board.getForums` — retrieves the list of forums.
- `topic.get` — retrieves topics and their latest post dates.
- `post.get` — retrieves posts for individual topics.

API requests are sent to:

```text
/api.php
```

using `POST` requests with JSON responses.

## Statistics

### Top by Number of Posts

Shows users with the highest number of posts within the selected date range.

### Top by Character Count

Shows users with the highest total number of characters written within the selected date range. HTML tags are removed before counting characters.

### Most Active Topics

Shows topics with the highest number of posts made by target users during the selected period.

## Dependencies

- jQuery
- Forum API
- `window.PR_FORUMS`
- `window.PLAY_FORUMS`

The interface uses the existing `--accent-color`, `--accent-color-contrast`, and `--text-on-accent` CSS variables for buttons and links.
