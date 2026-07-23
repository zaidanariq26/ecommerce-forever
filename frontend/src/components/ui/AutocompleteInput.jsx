import { useState, useRef, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";

const AutocompleteInput = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Type to search...",
  disabled = false,
}) => {
  const [query, setQuery] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const containerRef = useRef(null);
  const lastFiredRef = useRef(null);

  const filtered = useMemo(() => {
    if (!query) return options.slice(0, 8);
    const lower = query.toLowerCase();
    return options
      .filter((opt) => opt.toLowerCase().includes(lower))
      .slice(0, 8);
  }, [query, options]);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectOption = (option) => {
    onChange(option);
    setQuery(option);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filtered.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filtered.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
          selectOption(filtered[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  const handleScrollHighlight = () => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex];
      if (item) {
        item.scrollIntoView({ block: "nearest" });
      }
    }
  };

  const handleKeyUp = () => {
    if (!query) {
      lastFiredRef.current = null;
      return;
    }
    if (lastFiredRef.current === query) return;

    const match = options.find(
      (opt) => opt.toLowerCase() === query.toLowerCase(),
    );
    if (match) {
      lastFiredRef.current = query;
      selectOption(match);
    }
  };

  useEffect(() => {
    handleScrollHighlight();
  }, [highlightedIndex]);

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="mb-1 block text-sm text-gray-600">{label}</label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (!e.target.value) onChange("");
          }}
          onFocus={() => !disabled && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={`w-full border border-gray-300 px-3 py-2 pr-8 text-sm focus:border-gray-500 focus:outline-none ${
            disabled ? "cursor-not-allowed bg-gray-50 text-gray-400" : ""
          }`}
        />
        {query && !disabled && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              onChange("");
              inputRef.current?.focus();
            }}
            aria-label="Clear input"
            className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
          >
            <Icon icon="solar:close-circle-bold" className="text-base" />
          </button>
        )}
      </div>

      {isOpen && !disabled && filtered.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 mt-1 max-h-48 w-full overflow-auto border border-gray-200 bg-white shadow-lg"
        >
          {filtered.map((option, index) => (
            <li
              key={option}
              onClick={() => selectOption(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`cursor-pointer px-3 py-2 text-sm ${
                index === highlightedIndex
                  ? "bg-gray-100"
                  : "hover:bg-gray-50"
              } ${
                option === value ? "font-medium text-gray-900" : "text-gray-700"
              }`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}

      {isOpen && !disabled && query && filtered.length === 0 && (
        <div className="absolute z-50 mt-1 w-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-400 shadow-lg">
          No results found
        </div>
      )}
    </div>
  );
};

AutocompleteInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

export default AutocompleteInput;
