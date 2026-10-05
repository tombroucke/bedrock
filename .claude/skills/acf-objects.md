---
name: acf-objects
description: Guidelines for using AcfObjects (tombroucke/acf-objects) to retrieve and output ACF field values.
---

# When to use AcfObjects

The theme relies heavily on Advanced Custom Fields. Use `AcfObjects::getField()` (tombroucke/acf-objects) instead of the built-in `get_field()` for:

- Image field
- File field
- Repeater field
- Group field

# Field definitions

Never set `return_format` on ACF field definitions when using AcfObjects. AcfObjects detects the field type and handles formatting internally — setting a return format will interfere with this.

# Retrieving fields

Use `AcfObjects::getField('field_name')`, or pass a second argument for context (e.g. `'term_' . $term_id`).

# Checking if a field has a value

Use `->isSet()` to check whether a field has a value before using it.

# Common methods

- `->isSet()` — all field types
- `->url()` — File, Image
- `->image('size')` — Image (renders an `<img>` tag)
- `->title()`, `->url()`, `->target()` — Link
- `->isEmpty()` — Repeater, Group
- `->get('key')` — Group

# Examples

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
