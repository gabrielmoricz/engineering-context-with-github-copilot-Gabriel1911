"use client";

import { useId, useState } from "react";

type TagAutocompleteProps = {
  availableTags: readonly string[];
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function getSuggestions(value: string, availableTags: readonly string[]) {
  const commaIndex = value.lastIndexOf(",");
  const currentToken = value.slice(commaIndex + 1).trim();
  if (!currentToken) return [];

  const selectedTags = new Set(
    value
      .split(",")
      .slice(0, -1)
      .map((tag) => tag.trim().toLocaleLowerCase()),
  );
  const query = currentToken.toLocaleLowerCase();

  return availableTags.filter(
    (tag) => tag.toLocaleLowerCase().startsWith(query) && !selectedTags.has(tag.toLocaleLowerCase()),
  );
}

export function TagAutocomplete({ availableTags, label, value, onChange }: TagAutocompleteProps) {
  const inputId = useId();
  const listboxId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const suggestions = getSuggestions(value, availableTags);
  const listIsVisible = isOpen && suggestions.length > 0;

  function selectTag(tag: string) {
    const commaIndex = value.lastIndexOf(",");
    const prefix = commaIndex === -1 ? "" : value.slice(0, commaIndex + 1).trimEnd();
    onChange(prefix ? `${prefix} ${tag}` : tag);
    setIsOpen(false);
  }

  return (
    <div className="tag-autocomplete">
      <input
        aria-autocomplete="list"
        aria-controls={listIsVisible ? listboxId : undefined}
        aria-expanded={listIsVisible}
        aria-label={label}
        autoComplete="off"
        id={inputId}
        name="tags"
        placeholder="wedding, portrait, outdoor..."
        onChange={(event) => {
          const nextValue = event.currentTarget.value;
          onChange(nextValue);
          setIsOpen(getSuggestions(nextValue, availableTags).length > 0);
        }}
        role="combobox"
        type="text"
        value={value}
      />
      {listIsVisible ? (
        <div className="tag-suggestions" id={listboxId} role="listbox">
          {suggestions.map((tag) => (
            <button
              className="tag-suggestion"
              key={tag}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectTag(tag)}
              role="option"
              aria-selected={false}
              type="button"
            >
              {tag}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}