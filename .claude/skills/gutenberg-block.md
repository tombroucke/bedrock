---
name: gutenberg-block
description: Create and update gutenberg blocks.
---

# Publishing blocks

There are barebone pre-made blocks in tombroucke/otomaties-sage-helper. These can be published to the theme using `wp acorn vendor:publish`. Before creating a new block, check if the block can be scaffolded from here.

# Creating a new block

Use the `wp acorn acf:block {BlockName}` command. This will create 2 files

- controller: web/app/themes/project-name/app/Blocks/BlockName.php
- view: web/app/themes/project-name/resources/views/blocks/block-name.blade.php

These fields are loaded automatically.

# Styling

A .scss file in web/app/themes/project-name/resources/styles/blocks, with the same name as the view, will be automatically enqueued.

# JavaScript

A .js file in web/app/themes/project-name/resources/scripts/blocks, with the same name as the view, will be automatically imported (dynamic import).

## Using Swiper in a block

If the block uses Swiper, add the block to the swiper condition in `web/app/themes/project-name/app/View/Composers/App.php` so the `swiper.scss` stylesheet is conditionally enqueued:

```php
if (Post::hasBlock('acf/brands') || Post::hasBlock('acf/carousel') || ... || Post::hasBlock('acf/my-block')) {
    $assets[] = 'resources/styles/swiper.scss';
}
```

## Using Fancybox in a block

If the block uses Fancybox, add the block to the fancybox condition in `web/app/themes/project-name/app/View/Composers/App.php` so the `fancybox.scss` stylesheet is conditionally enqueued:

```php
if (Post::hasBlock('core/image') || Post::hasBlock('acf/gallery') || ... || Post::hasBlock('acf/my-block')) {
    $assets[] = 'resources/styles/fancybox.scss';
}
```

# Updating a block

- Renaming or removing a field is not safe if the block has already been used on published content. ACF stores field values against the field name, so a rename orphans every value already saved under the old name — it won't show an error, the data just silently stops appearing. If a rename is genuinely needed, say so explicitly and mention that existing block instances will need a data migration (or leave the old field in place, deprecated, alongside the new one) rather than doing a silent rename.
- Adding a field is safe
