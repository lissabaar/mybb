# Goyangi Light Teal

**Goyangi Light Teal** — дефолтный стиль оформления для форумов на базе **MyBB** и **Rusff**.

Стиль разработан специально с учетом структуры этих форумов, их ограничений и особенностей доступной верстки.

Превью: https://goyangi.mybb.ru/

## Структура файлов

Стиль разделен на **два CSS-файла** в соответствии с названиями окон в панели администратора форумов в разделе **«Свой стиль»**.

### `style.css`

**Структура style.css — тут лежат импорты и моб версия**

В файле находятся:

- импорты необходимых стилей;
- мобильная версия оформления;
- адаптивные правила для небольших экранов.

### `style_cs.css`

**Цвета style_cs.css — тут основной стиль, структура цвета и ПК версия**

В файле находятся:

- основной стиль оформления;
- структура цветовой схемы;
- оформление элементов форума;
- десктопная (ПК) версия;
- основные визуальные параметры.

> **Важно:** файлы предназначены для размещения именно в соответствующих разделах редактора стиля MyBB / Rusff. Не объединяйте их в один файл.

## Совместимость

Стиль рассчитан на форумную структуру **MyBB / Rusff** и учитывает ограничения и особенности CSS/HTML, доступные при оформлении форумов через встроенный редактор стилей.

## Особенности

- разделение стилей на два файла по структуре редактора форума;
- отдельная мобильная версия;
- отдельная десктопная версия;
- структура и цветовое оформление вынесены в соответствующие разделы;
- адаптация под стандартную структуру MyBB / Rusff;
- не требует изменения шаблонов форума для базовой установки.

---

# Goyangi Light Teal — English

**Goyangi Light Teal** is a default forum theme designed for **MyBB** and **Rusff** forums.

The theme is specifically built around the structure, limitations, and layout features of these forum platforms.

Preview: https://goyangi.mybb.ru/

## File Structure

The theme is divided into **two CSS files**, following the names of the style editor sections in the forum administration panel under **"Custom style"**.

### `style.css`

**Structure style.css — imports and mobile version**

This file contains:

- required style imports;
- the mobile version of the theme;
- responsive rules for smaller screens.

### `style_cs.css`

**Colors style_cs.css — main style, color structure, and desktop version**

This file contains:

- the main theme styling;
- the color structure;
- forum element styling;
- the desktop version;
- main visual parameters.

> **Important:** The files are intended to be placed in their respective sections of the MyBB / Rusff style editor. Do not merge them into a single file.

## Compatibility

The theme is designed for the **MyBB / Rusff** forum structure and takes into account the CSS/HTML limitations and layout features available through the built-in forum style editor.

## Features

- styles divided into two files according to the forum style editor structure;
- separate mobile version;
- separate desktop version;
- structure and color styling separated into their respective sections;
- adapted to the standard MyBB / Rusff forum structure;
- no template modifications required for basic installation.
