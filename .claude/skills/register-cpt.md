---
name: register-cpt
description: Register a custom post type. Use when the user asks to add a custom post type or CPT.
---

Use the `wp acorn project-name:post-type` command. The post type will be registered using `johnbillion/extended-cpts`. A file will be created in web/app/mu-plugins/project-name/src/PostTypes, and is auto-loaded from the mu-plugin's `AppServiceProvider.php`.
