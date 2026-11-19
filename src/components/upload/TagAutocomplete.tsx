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
    (tag) =>
      tag.toLocaleLowerCase().startsWith(query) &&
      !selectedTags.has(tag.toLocaleLowerCase()),
  );
}

export function TagAutocomplete({
  availableTags,
  label,
  value,
  onChange,
}: TagAutocompleteProps) {
  const inputId = useId();
  const listboxId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const suggestions = getSuggestions(value, availableTags);
  const listIsVisible = isOpen && suggestions.length > 0;
  const activeOptionId =
    listIsVisible && activeIndex >= 0 && activeIndex < suggestions.length
      ? `${listboxId}-option-${activeIndex}`
      : undefined;

  function selectTag(tag: string) {
    const commaIndex = value.lastIndexOf(",");
    const prefix = commaIndex === -1 ? "" : value.slice(0, commaIndex + 1).trimEnd();

    onChange(prefix ? `${prefix} ${tag}` : tag);
    setIsOpen(false);
    setActiveIndex(-1);
  }

  return (
    <div className="tag-autocomplete">
      <input
        aria-activedescendant={activeOptionId}
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
          setActiveIndex(-1);
        }}
        onKeyDown={(event) => {
          if (
            (event.key === "ArrowDown" || event.key === "ArrowUp") &&
            suggestions.length > 0
          ) {
            event.preventDefault();
            setIsOpen(true);
            setActiveIndex((current) => {
              if (!listIsVisible || current < 0 || current >= suggestions.length) {
                return event.key === "ArrowDown" ? 0 : suggestions.length - 1;
              }

              const direction = event.key === "ArrowDown" ? 1 : -1;
              return (current + direction + suggestions.length) % suggestions.length;
            });
          } else if (
            event.key === "Enter" &&
            listIsVisible &&
            activeIndex >= 0 &&
            activeIndex < suggestions.length
          ) {
            event.preventDefault();
            selectTag(suggestions[activeIndex]);
          } else if (event.key === "Escape" && listIsVisible) {
            event.preventDefault();
            setIsOpen(false);
            setActiveIndex(-1);
          } else if (event.key === "Tab" && listIsVisible) {
            setIsOpen(false);
            setActiveIndex(-1);
          }
        }}
        role="combobox"
        type="text"
        value={value}
      />

      {listIsVisible ? (
        <div className="tag-suggestions" id={listboxId} role="listbox">
          {suggestions.map((tag, index) => (
            <button
              aria-selected={index === activeIndex}
              className={`tag-suggestion${index === activeIndex ? " is-active" : ""}`}
              id={`${listboxId}-option-${index}`}
              key={tag}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectTag(tag)}
              role="option"
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