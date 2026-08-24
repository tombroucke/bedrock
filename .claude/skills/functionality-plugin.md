---
name: functionality-plugin
description: Add functionality to this website.
---

# Default options

By default, this plugin provides a "General" options page, with company info, social media links, opening hours and newsletter signup form.
It provides a shortcode + view for the opening hours `[opening-hours]` and the newsletter signup form `[newsletter-signup-form]`.

## Contact information

You could also use the `[contact-information]` shortcode or `@include('ProjectName::shortcodes.contact-information')`

```
[contact-information property="address"]
[contact-information property="phone"]
[contact-information property="email"]
[contact-information property="vat_number"]
[contact-information property="bank_account_number"]
```

## Social media

To fetch social media, you can use the Facade `ProjectNameSocialMedia`.

```php
$channels = ProjectNameSocialMedia::channels()
```

# Functionality

- Str::phoneLink('+12 345 678 910')
- Str::emailLink('hello@example.com')

# Adding functionality

The `boot()` method of `src/Providers/ProjectNameServiceProvider.php` is an entrypoint for custom functionality.

## Frontend & Admin

For hooks that should only run on the frontend or in the admin, use the dedicated classes:

- `web/app/mu-plugins/project-name/src/Frontend.php` — frontend-only hooks, use `runHooks()` method
- `web/app/mu-plugins/project-name/src/Admin.php` — admin-only hooks, use `runHooks()` method

Both use the `HasHooks` trait and are accessible via the `ProjectNameFrontend` and `ProjectNameAdmin` facades.

## Opening Hours

The `OpeningHours` class (`web/app/mu-plugins/project-name/src/OpeningHours.php`) reads opening hours from ACF options and returns a collection:

```php
$schedule = app(OpeningHours::class)->schedule();
// Returns a collection of ['day' => '...', 'hours' => [...]] per weekday
```

The `[opening-hours]` shortcode and its view handle the display.

# Acorn commands

## Register post type

`wp acorn project-name:post-type Story`

Where 'Story' is the name of your post type. Story should be PascalCase. The post type slug and labels will be generated automatically. A Story.php file will be created in web/app/mu-plugins/project-name/src/PostTypes, and will be registered automatically.

## Register taxonomy

`wp acorn project-name:taxonomy Genre Story`

Where 'Genre' is the name of your taxonomy and 'Story' is your post type. Both should be PascalCase. The taxonomy slug and labels will be generated automatically. A Genre.php file will be created in web/app/mu-plugins/project-name/src/Taxonomies, and will be registered automatically.

## Add ACF Options page

`wp acorn project-name:options-page CustomOptions`

Where 'CustomOptions' is the name of your options page. CustomOptions should be PascalCase. A CustomOptions.php file will be created in web/app/mu-plugins/project-name/src/OptionsPages, and will be registered automatically.

## Add shortcode

`wp acorn project-name:shortcode CustomShortcode`

Where 'CustomShortcode' is the PascalCase version of 'custom-shortcode'. A controller will be created in web/app/mu-plugins/project-name/src/Shortcodes, and a view will be created in web/app/mu-plugins/project-name/resources/views/shortcodes.

## Seed data

`wp acorn project-name:seed`

Runs database seeders defined in `web/app/mu-plugins/project-name/src/Database/Seeders/`. Currently seeds the HTML Forms plugin with pre-configured forms and email templates.
