---
name: register-custom-field
description: Register a custom field like post meta, user meta, ...
---

# Register new fields

- Gutenberg blocks have their own method `fields()` method where you can register fields using log1x/acf-composer
- If the type of field is related to layout, use the command `wp acorn acf:field`, so the field goes into web/app/themes/project-name/app/Fields. E.g. true/false field to add padding/margin, select field to add a button class to a menu item, image field to display on top of a term template. These fields are registered using log1x/acf-composer, which in turn relies on stoutlogic/acf-builder.
- In other cases, use the command `wp acorn project-name:field`, so the field goes into web/app/mu-plugins/project-name/src/Fields. If the field is related to a post type, the name of the file, should be the name of the post type, so all related fields are grouped. These fields are registered using stoutlogic/acf-builder.

Before adding a new field file, make sure there is no related file where we can append this field

# Acf Objects

The theme relies heavily on Advanced Custom Fields. For some fields, we want to rely on `AcfObjects::getField()` (tombroucke/acf-objects) instead of the built-in `get_field()` method:

- Image field
- Repeater field
- Group field

This gives us easier output like:

```blade
@foreach (AcfObjects::getField('gallery') as $image)
  <a href="{{ $image->url('large') }}">
    {!! $image->image('medium') !!}
  </a>
@endforeach
```

```blade
@unless(AcfObjects::getField('repeater')->isEmpty())
<ul>
  @foreach(AcfObjects::getField('repeater') as $item)
    <li>{!! $item['name'] !!}</li>
  @endforeach
</ul>
@endunless
```

```php
  $settings = AcfObjects::getField('settings')
    ->default([
      'foo' => 'bar'
    ]);

  echo $settings->get('foo');
```

```blade
{{ AcfObjects::getField('settings')->get('name') }}
```
