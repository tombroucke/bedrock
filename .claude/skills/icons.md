---
name: icons
description: How to use icons in Blade views.
---

# Font Awesome

Font Awesome is available via `owenvoke/blade-fontawesome`. Always use the `@svg()` Blade directive — not `<i class="fa ...">` or `<x-fas-*>` components.

Always add `height="1em"` so icons scale with surrounding text.

```blade
@svg('fas-th-large', ['height' => '1em'])
@svg('fab-github', ['height' => '1em'])
```

Icon names follow the pattern `{prefix}-{icon-name}`:
- `fas-*` — solid
- `far-*` — regular
- `fab-*` — brands
