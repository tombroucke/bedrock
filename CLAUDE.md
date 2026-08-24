This is a WordPress website built on top of roots/bedrock, using a modified version of the roots/sage theme.

# Global

Add hooks and filters with tombroucke/wp-fluent-hooks instead of the default add_filter and add_action.

# Theme

The theme, web/app/themes/project-name, is built on top of roots/sage. Pages and posts are built using both native gutenberg blocks as well as custom acf blocks. Everything related to style, frontend (gutenberg blocks, nav, templates etc.) go in the theme.

# Functionality

Functionality goes into web/app/mu-plugins/project-name.

# Build

The theme uses Vite (`vite.config.js`) as its build tool.

# Formatting

PHP formatting is handled automatically by Laravel Pint via a hook — don't hand-format or second-guess spacing/quote style/brace placement, it'll be corrected after every edit.

# Skills

Project-specific skills are in `.claude/skills/`. Always read the relevant skill file before implementing anything that might match (animations, blocks, CPTs, i18n, WooCommerce, deployment, etc.).
