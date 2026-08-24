---
name: theme
description: Instructions on how to work with this theme.
---

This is a starter theme, based on the [roots/sage](https://github.com/roots/sage) starter theme

# Features

## Bootstrap

- Bootstrap is loaded by default. You should comment out components & helpers in web/app/themes/project-name/resources/styles/config/bootstrap to decrease build time / filesize.
- Always prefer to edit styles in web/app/themes/project-name/resources/styles/config/\_variables.scss instead of adding new selectors in another .scss file.
- Custom pagination (`@include('partials.pagination')`)
- Breadcrumb (`@include('partials.breadcrumb')`)
- Some components might not be rendered correctly (missing styles), this could be fixed by
  - uncommenting the component in `web/app/themes/project-name/resources/styles/config/bootstrap/components.scss` or `web/app/themes/project-name/resources/styles/config/bootstrap/helpers.scss`.
  - enqueuing the modal styles by uncommenting the relevant line in `web/app/themes/project-name/app/View/Composers/App.php`

## PurgeCSS

Add css classes to `purgecss-safelist.js` to whitelist
Add css classes to `purgecss-blocklist.js` to block

## WPML

Add `@include('partials.language-switcher')` to have a WPML language switcher appear

## Built-in support for headroom.js

All you need to do is add styling for the headroom classes (`banner--not-top`, `banner--unpinned`, ...)

[WickyNilliams/headroom.js](https://github.com/WickyNilliams/headroom.js)

## Custom block styles

In `web/app/themes/project-name/resources/scripts/editor.js`, we add a 'Lead' style to the `core/paragraph` block. You can add additional block styles to native gutenberg blocks in the same manner. For custom blocks, you can add the custom styles in the `$styles` property of the block.

## Custom directives

### @ray(mixed $variable)

Outputs a variable to your [Ray](https://spatie.be/products/ray) console

### @background(string $image)

You can pass an image url, which will be added as an inline style background-image.

### @shortcode('[shortcode]')

Renders the given shortcode

### @year

Will render the current year

### @preview($block)

Content of this block will only be rendered in the admin interface

### @echoWhen(bool $condition, string $markup)

Echo markup when condition is true

# Theme files

## setup.php vs filters.php

- `web/app/themes/project-name/app/setup.php` — theme setup: registering menus, sidebars, theme support, enqueuing editor assets, Livewire wiring
- `web/app/themes/project-name/app/filters.php` — WordPress filters and actions that modify output: block rendering tweaks, body classes, breadcrumb customisation, etc.

## Interactive components

For interactive UI components or blocks that require reactivity, use Livewire. Alpine.js is available but should only be used within Livewire components.

## Blade components

A full Bootstrap 5 component library is available. Use them in Blade templates with the `x-` prefix. Examples:

```blade
<x-alert theme="danger" dismissible>A simple alert</x-alert>

<x-badge theme="danger" pill>A badge</x-badge>

<x-button theme="primary">Button label</x-button>

<x-modal id="my-modal">
  <x-slot name="title">Title</x-slot>
  Content
  <x-slot name="footer">
    <x-button tag="button" type="button" theme="secondary" data-bs-dismiss="modal">Close</x-button>
  </x-slot>
</x-modal>
<x-trigger.modal theme="danger" target="my-modal">Open modal</x-trigger.modal>

<x-collapse.accordion id="my-accordion">
  <x-collapse.accordion.item accordion-id="my-accordion" show>
    <x-slot name="heading">Title</x-slot>
    Content
  </x-collapse.accordion.item>
</x-collapse.accordion>
```

Available components: `alert`, `badge`, `button`, `button.group`, `card`, `checkbox`, `collapse.accordion`, `input-group`, `list-group`, `modal`, `nav.tabs`, `offcanvas`, `pagination`, `radio`, `spinner`, `table`, `toast` — plus triggers: `trigger.modal`, `trigger.offcanvas`, `trigger.toast`.

Interactive components (accordion, modal, offcanvas, toast) require the relevant Bootstrap JS import in the block's `.js` file.

## Fancybox & Swiper

Fancybox and Swiper are already installed and their stylesheets are registered in `vite.config.js`. They are conditionally enqueued in `web/app/themes/project-name/app/View/Composers/App.php` based on which blocks are present on the page. To enqueue them for additional blocks or conditions, add the relevant check there:

```php
if (Post::hasBlock('acf/my-block')) {
    $assets[] = 'resources/styles/fancybox.scss';
    // or
    $assets[] = 'resources/styles/swiper.scss';
}
```

## Post facade

The `Post` facade (`App\Facades\Post`) provides block and shortcode detection for the current post, including reusable blocks:

```php
Post::hasBlock('acf/hero');       // true/false
Post::hasShortcode('my-form');    // true/false
Post::allBlocks();                // Collection of all blocks incl. inner + reusable
```

Used in `App.php` to conditionally enqueue assets.

## Rich snippets

A `FaqPage` rich snippet service exists at `app/Services/RichSnippets/FaqPage.php`. It reads all `acf/accordion` blocks on the page and outputs a `FAQPage` JSON-LD schema. The view is at `resources/views/partials/schema/faq.blade.php`. Include it by calling `app(FaqPage::class)->render()` in the appropriate template.

# Plugin styles

Styles for third-party or custom plugins should go in a separate `.scss` file in `resources/styles/partials/`, not mixed into `app.scss` directly. Import the file from `app.scss`:

```scss
@import "partials/cookie-consent";
@import "partials/my-plugin";
```

The cookie consent plugin (`otomaties-cookie-consent`) already has its styles at `resources/styles/partials/_cookie-consent.scss`.

# Customization

## Blocks

### Default blocks from Otomaties sage helper

Default blocks (accordion, cards, gallery, hero, ...) can be easily added from [Otomaties sage helper](https://github.com/tombroucke/otomaties-sage-helper) e.g.:

```sh
wp acorn vendor:publish --tag="Otomaties block Buttons"
```

- .js files in web/app/themes/project-name/resources/scripts/blocks will be dynamically imported if there is a block matching the name. E.g. `web/app/themes/project-name/resources/views/blocks/image-content.blade.php` > `web/app/themes/project-name/resources/scripts/blocks/image-content.js`
- .scss files in web/app/themes/project-name/resources/styles/blocks will be automatically enqueued in case there is a block with the same name (without namespace). If you want to enqueue a block style for `core/paragraph`, you should create `web/app/themes/project-name/resources/styles/blocks/paragraph.scss`.

### Custom blocks

Custom blocks can be added using [Log1x/acf-composer](https://github.com/Log1x/acf-composer) e.g.:

```sh
wp acorn acf:block MyCustomBlock
```

See [ACF Builder Cheatsheet](https://github.com/Log1x/acf-builder-cheatsheet)

You can add styles for your block in `web/app/themes/project-name/resources/styles/blocks/my-block.scss`. These will automatically be enqueued by the theme. If you need bootstrap variables, mixins etc.:

```css
@import "bootstrap/scss/mixins";
@import "bootstrap/scss/functions";
@import "./../config/variables";
@import "bootstrap/scss/variables";
```

## Google Fonts

0. Install [Laravel Webfonts](https://github.com/Log1x/laravel-webfonts)
1. Run `wp acorn webfonts:add`, follow the wizard
2. `resources/styles/fonts.scss` is already registered in `vite.config.js` and enqueued via `web/app/themes/project-name/app/View/Composers/App.php` — no further setup needed

## Theme.json

### Container

There are 2 widths for containers: contentSize (768px) and wideSize (1320px). These can be changed from the theme.json

### Colors

Colors defined in `web/app/themes/project-name/resources/styles/config/_variables.scss` should be copied over to theme.json (`settings.color.palette`). There is a ThemeJson facade to extract the colors.

**Get a <key, value> list of all theme colors in PHP:**

```php
ThemeJson::colors()->pluck('name', 'slug');
```

## Navigation

- This starter theme uses [Log1x/navi](https://github.com/Log1x/navi). The navigation is built in `app/View/Composers/Navigation.php`.
- You can add bootstrap button classes to menu items (e.g. `btn btn-primary`) to style them as buttons
- You can add fontawesome classes to add icons (e.g. `fas-envelope`)
- `web/app/themes/project-name/resources/scripts/components/header.js` will listen to click events on a `.menu-item--has-submenu` element, and toggle the `menu-item--open` class on this element. It will also remove the `menu-item--open` class from every other element

### Mobile nav

- `web/app/themes/project-name/resources/scripts/components/header.js` will listen to click events on a `.navbar-toggler` element, and toggle the `primary-nav-open` class on the body element.

## Google maps

If you're using Google Maps, you can add the GOOGLE_MAPS_KEY variable to your .env file

# Snippets

## SVG logo

File should be in `web/app/themes/project-name/resources/svg/logoname.svg`

```blade
@svg('logoname', ['height' => '2em'])
{{-- or --}}
<x-icon-logoname height="2em" />
```

## Get a list of fontawesome icons in a list

```php
// app/Providers/ThemeServiceProvider.php
$this->app->bind('icons', function() {
    return Cache::rememberForever('fontawesome-icons', function () {
        $icons = [];
        $sets = app()->make('BladeUI\Icons\Factory')->all();
        foreach ($sets as $setname => $set) {
            if (strpos($setname, 'fontawesome') === false) {
                continue;
            }

            $niceSetName = str_replace('fontawesome-', '', $setname);
            foreach ($set['paths'] as $path) {
                $files = glob($path . '/*.svg');
                foreach ($files as $file) {
                    $iconBasename = basename($file, '.svg');
                    $iconName = $set['prefix'] . '-'. $iconBasename;
                    $icons[$iconName] = "$iconBasename $niceSetName";
                }
            }
        }
        return $icons;
    });
});


// app/Blocks/BlockWithIcons.php
...
->addSelect('icon', [
    'label' => __('Icon', 'sage'),
    'choices' => app()->make('icons'),
    'default_value' => 'fas-star',
    'ajax' => 1,
])
...

```
