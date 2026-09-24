# Быстрое копирование ссылки на пост

Скрипт для **MyBB / Rusff**, который позволяет быстро копировать прямую ссылку на конкретный пост.

При нажатии на дату поста (permalink, например: `Сегодня 13:10:00`):

- ссылка на пост копируется в буфер обмена;
- URL страницы заменяется на прямую ссылку на этот пост - актуально при включенной AJAX-отправке сообщений;
- рядом появляется уведомление `скопировано`;
- AJAX отправка сообщений поддержана;
- предусмотрен fallback для старых версий браузеров без поддержки `navigator.clipboard`;
- копируется абсолютная ссылка на пост без привязки к номеру страницы, поэтому он корректно откроется независимо от того, какое количество постов на странице темы указано в настройках отображения у пользователя;

## Установка

Скрипт устанавливается в админке форума:

**Админка → Формы → HTML верх** или **HTML низ**

Код необходимо поместить между тегами `<script>` и `</script>`.

## Стилизация уведомления

После нажатия на permalink скрипт автоматически создает уведомление с классом:

`copy-post-msg`

Для изменения его внешнего вида добавьте CSS-правила для `.copy-post-msg`.

### Пример

```css
.copy-post-msg {
  padding: 3px 10px !important;
  background: #00000010 !important;
  color: red;
  border-radius: 3px;
  font-size: 12px;
}
```

Можно изменить любые визуальные параметры уведомления: фон, цвет текста, размер шрифта, отступы, скругление, границу и т. д.

По умолчанию скрипт задает уведомлению следующие inline-стили:

```css
background: #00000010;
padding: 3px 10px;
margin-left: 10px;
```

При необходимости эти значения можно переопределить через `.copy-post-msg`.

---

# Quick Post Link Copy

A **MyBB / Rusff** script that allows users to quickly copy a direct link to a specific post.

When clicking the post date (permalink, e.g. `Today 13:10:00`):

- the post link is copied to the clipboard;
- the page URL is replaced with the direct link to the post — useful when AJAX post submission is enabled;
- a `скопировано` notification appears next to the permalink;
- AJAX post submission is supported;
- a fallback is provided for older browser versions without `navigator.clVipboard` support;
- an absolute link to the post is copied without a page number, so it will open correctly regardless of how many posts per page the user has configured in their display settings;

## Installation

Install the script in the forum admin panel:

**Admin Panel → Forms → HTML header** or **HTML footer**

Place the code between `<script>` and `</script>` tags.

## Styling the Notification

After a permalink is clicked, the script automatically creates a notification with the class:

`copy-post-msg`

To customize its appearance, add CSS rules for `.copy-post-msg`.

### Example

```css
.copy-post-msg {
  padding: 3px 10px !important;
  background: #00000010 !important;
  color: red;
  border-radius: 3px;
  font-size: 12px;
}
```

You can customize any visual properties of the notification, including its background, text color, font size, spacing, border, and border radius.

By default, the script applies the following inline styles to the notification:

```css
background: #00000010;
padding: 3px 10px;
margin-left: 10px;
```

These values can be overridden with `.copy-post-msg` CSS rules.
