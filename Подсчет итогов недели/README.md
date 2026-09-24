# Статистика активности

Инструмент для сбора статистики активности пользователей и тем форума за выбранный период (неделя по умолчанию).

## Файлы

- `index.html` — HTML-структура и интерфейс статистики
- `style.css` — стили интерфейса
- `script.js` — логика подсчёта статистики и работа с API

## Возможности

- Выбор произвольного периода для подсчёта статистики.
- Автоматическая установка периода по умолчанию: от 7 дней до вчерашнего дня.
- Получение пользователей из заданных групп.
- Подсчёт количества сообщений пользователей.
- Подсчёт общего количества символов в сообщениях пользователей.
- Определение наиболее активных тем по количеству сообщений.
- Отображение топа пользователей и тем для каждой статистики.
- Отображение прогресса и текущего этапа подсчёта.
- Получение данных через API форума.
- Задержка между API-запросами для снижения нагрузки.

## Конфигурация

Основные настройки находятся в `script.js`:

```javascript
const CONFIG = {
  excludeForums: [1, 2, 3], // ID подфорумов, исключаемых из подсчёта
  charCountForums: [1, 3, 4], // ID подфорумов для подсчёта символов
  targetGroups: [1, 2, 5], // ID групп пользователей
  topLimit: 30, // количество результатов в каждом топе
  maxTopics: 100, // максимальное количество обрабатываемых тем
  requestDelay: 500, // задержка между API-запросами в миллисекундах
};
```

### Параметры

Изменение параметров позволяет адаптировать статистику под структуру конкретного форума без изменения основной логики скрипта.

| Параметр          | Описание                                                                                                                                                                                                                                                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `excludeForums`   | ID форумов, которые полностью исключаются из подсчёта сообщений. Можно использовать для исключения рекламы, служебных разделов и других форумов, которые не должны влиять на статистику.                                                                                                                                                  |
| `charCountForums` | ID форумов, в которых дополнительно рассчитывается количество символов. Используется для разделов, где важен объём написанного текста, например игровых форумов.                                                                                                                                                                          |
| `targetGroups`    | ID групп пользователей, которые участвуют в статистике. Пользователи из остальных групп не учитываются.                                                                                                                                                                                                                                   |
| `topLimit`        | Максимальное количество пользователей или тем, отображаемых в каждом итоговом топе. Не влияет на сам сбор данных.                                                                                                                                                                                                                         |
| `maxTopics`       | Максимальное количество тем, обрабатываемых при сборе статистики. При увеличении значения будет обработано больше тем, но увеличится время выполнения и количество API-запросов.                                                                                                                                                          |
| `requestDelay`    | Задержка между API-запросами в миллисекундах. Используется для снижения нагрузки на API. Не рекомендуется устанавливать слишком маленькое значение: большое количество частых запросов может привести к ограничению или блокировке запросов со стороны сервера. Для стабильной работы рекомендуется сохранять значение не менее `500` мс. |

## API

Для получения данных используется API MyBB — [документация Forum API](https://mybb.ru/forumapi/).

- `users.get` — получение пользователей из заданных групп.
- `board.getForums` — получение списка форумов.
- `topic.get` — получение тем и информации об их активности.
- `post.get` — получение сообщений выбранных тем.

Запросы выполняются последовательно с задержкой, заданной параметром `requestDelay`.

## Установка

Рекомендуемый способ установки — через раздел админки **«Страницы»**.

1. Создайте новую страницу в разделе **«Страницы»**.
2. Добавьте содержимое `index.html` в HTML-код страницы.
3. Содержимое `script.js` разместите на этой же странице внутри тега `<script>`.
4. Стили из `style.css` можно разместить на этой же странице внутри тега `<style>` или подключить отдельно как внешний CSS-файл.

JavaScript:

    <script>
    // содержимое script.js
    </script>

CSS:

    <style>
    /* содержимое style.css */
    </style>

JavaScript рекомендуется размещать после HTML-разметки страницы.

## Настройка

Перед использованием необходимо проверить значения `CONFIG` в `script.js` и указать актуальные ID:

- подфорумов, исключаемых из статистики;
- подфорумов, в которых необходимо считать символы;
- групп пользователей, участвующих в статистике.

Остальные параметры можно оставить стандартными или изменить при необходимости.

## Логика работы

После запуска расчёта скрипт последовательно:

1. Получает пользователей из указанных групп.
2. Получает список форумов и исключает форумы из `excludeForums`.
3. Находит темы с активностью за выбранный период.
4. Загружает сообщения найденных тем.
5. Фильтрует сообщения по выбранному периоду и учитываемым пользователям.
6. Рассчитывает количество сообщений и символов.
7. Формирует и сортирует итоговые данные для трёх статистик.

## Использование

1. Откройте страницу со статистикой.
2. При необходимости измените даты начала и окончания периода.
3. Нажмите кнопку **«Рассчитать»**.
4. Дождитесь завершения обработки.
5. Просмотрите сформированные результаты.

По умолчанию используется период от 7 дней до вчерашнего дня.

## Результаты

В интерфейсе отображаются три основных списка:

- **Топ пользователей по сообщениям** — пользователи с наибольшим количеством сообщений за выбранный период.
- **Топ пользователей по символам** — пользователи с наибольшим общим количеством символов в сообщениях.
- **Самые активные темы** — темы с наибольшим количеством сообщений.

Количество отображаемых результатов для каждого списка определяется параметром `topLimit`.

## Ограничения

Количество обрабатываемых тем ограничено параметром `maxTopics`.

При большом количестве тем расчёт может занимать некоторое время из-за последовательной обработки API-запросов.

Не рекомендуется уменьшать `requestDelay` до слишком низких значений: большое количество частых API-запросов может привести к ограничению запросов или временной блокировке со стороны сервера.

# Activity Statistics

A tool for collecting user and topic activity statistics for a selected period (one week by default).

## Files

- `index.html` — HTML structure and statistics interface
- `style.css` — interface styles
- `script.js` — statistics calculation logic and API integration

## Features

- Select a custom period for calculating statistics.
- Automatically set the default period: from 7 days ago through yesterday.
- Retrieve users from specified groups.
- Count users' posts.
- Calculate the total number of characters in users' posts.
- Identify the most active topics by number of posts.
- Display top users and topics for each statistic.
- Display calculation progress and the current processing stage.
- Retrieve data through the forum API.
- Add a delay between API requests to reduce server load.

## Configuration

The main settings are located in `script.js`:

```javascript
const CONFIG = {
  excludeForums: [1, 2, 3], // IDs of forums excluded from statistics
  charCountForums: [1, 3, 4], // IDs of forums where character count is calculated
  targetGroups: [1, 2, 5], // IDs of user groups included in statistics
  topLimit: 30, // number of results displayed in each top list
  maxTopics: 100, // maximum number of topics processed
  requestDelay: 500, // delay between API requests in milliseconds
};
```

### Parameters

Changing these parameters allows the statistics to be adapted to the structure of a specific forum without modifying the main script logic.

| Parameter         | Description                                                                                                                                                                                                                                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `excludeForums`   | IDs of forums that are completely excluded from post counting. Can be used to exclude advertisements, service sections, and other forums that should not affect the statistics.                                                                                                                                |
| `charCountForums` | IDs of forums where the number of characters is additionally calculated. This is useful for sections where the amount of written text is important, such as roleplay forums.                                                                                                                                   |
| `targetGroups`    | IDs of user groups included in the statistics. Users from other groups are not included.                                                                                                                                                                                                                       |
| `topLimit`        | Maximum number of users or topics displayed in each final top list. Does not affect data collection.                                                                                                                                                                                                           |
| `maxTopics`       | Maximum number of topics processed when collecting statistics. Increasing this value allows more topics to be processed, but also increases execution time and the number of API requests.                                                                                                                     |
| `requestDelay`    | Delay between API requests in milliseconds. Used to reduce the load on the API. It is not recommended to set this value too low: a large number of frequent requests may result in request throttling or blocking by the server. For stable operation, keeping the value at `500` ms or higher is recommended. |

## API

Data is retrieved using the MyBB API — [Forum API documentation](https://mybb.ru/forumapi/).

- `users.get` — retrieves users from the specified groups.
- `board.getForums` — retrieves the list of forums.
- `topic.get` — retrieves topics and information about their activity.
- `post.get` — retrieves posts from the selected topics.

Requests are processed sequentially with a delay defined by the `requestDelay` parameter.

## Installation

The recommended installation method is through the **"Pages"** section of the admin panel.

1. Create a new page in the **"Pages"** section.
2. Add the contents of `index.html` to the page's HTML code.
3. Place the contents of `script.js` on the same page inside a `<script>` tag.
4. The styles from `style.css` can be placed on the same page inside a `<style>` tag or connected separately as an external CSS file.

JavaScript:

    <script>
    // contents of script.js
    </script>

CSS:

    <style>
    /* contents of style.css */
    </style>

It is recommended to place the JavaScript after the HTML markup of the page.

## Configuration Setup

Before using the tool, check the `CONFIG` values in `script.js` and specify the correct IDs for:

- forums excluded from the statistics;
- forums where character counting is required;
- user groups included in the statistics.

The remaining parameters can be left at their default values or changed if necessary.

## How It Works

After the calculation is started, the script sequentially:

1. Retrieves users from the specified groups.
2. Retrieves the list of forums and excludes the forums from `excludeForums`.
3. Finds topics with activity during the selected period.
4. Loads posts from the selected topics.
5. Filters posts by the selected period and included users.
6. Calculates the number of posts and characters.
7. Generates and sorts the final data for the three statistics.

## Usage

1. Open the statistics page.
2. Change the start and end dates if necessary.
3. Click the **"Calculate"** button.
4. Wait for the processing to finish.
5. Review the generated results.

By default, the selected period is from 7 days ago through yesterday.

## Results

The interface displays three main lists:

- **Top Users by Posts** — users with the highest number of posts during the selected period.
- **Top Users by Characters** — users with the highest total number of characters in their posts.
- **Most Active Topics** — topics with the highest number of posts.

The number of results displayed in each list is determined by the `topLimit` parameter.

## Limitations

The number of topics processed is limited by the `maxTopics` parameter.

When a large number of topics is processed, the calculation may take some time due to sequential API requests.

It is not recommended to reduce `requestDelay` to very low values: a large number of frequent API requests may result in request throttling or temporary blocking by the server.
