---
name: woocommerce
description: Manage WooCommerce templates and functionality
---

# Layout

When you need to update the WooCommerce layout, make changes in the theme:

- Register/remove actions and filters: web/app/themes/project-name/app/Providers/WooCommerceServiceProvider.php
- Update views: web/app/themes/project-name/resources/views/woocommerce

To pass data to the views, make use of Laravel composers `wp acorn make:composer`. Make sure there is no related, existing composer first.

# Functionality

Pure functionality changes should go into the mu-plugin web/app/mu-plugins/project-name/src/WooCommerce.php
