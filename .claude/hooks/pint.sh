#!/usr/bin/env bash
# Auto-formats PHP files with Laravel Pint after Claude edits them.

file=$(cat | jq -r '.tool_input.file_path // empty')

if [[ -n "$file" && "$file" == *.php && -f "$file" ]]; then
  vendor/bin/pint "$file" >/dev/null 2>&1
fi

exit 0
