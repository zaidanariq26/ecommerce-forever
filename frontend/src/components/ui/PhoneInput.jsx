import { useState, useRef, useEffect, useMemo } from "react";
import { Country } from "country-state-city";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";

const PhoneInput = ({
  label,
  value,
  onChange,
  placeholder = "Phone number",
}) => {
  const allCountries = useMemo(
    () =>
      Country.getAllCountries()
        .filter((c) => c.phonecode)
        .map((c) => ({
          name: c.name,
          isoCode: c.isoCode,
          flag: c.flag,
          phoneCode: c.phonecode.replace("+", "").split("-")[0],
        })),
    [],
  );

  // Parse initial value to extract country code
  const getInitialCountry = () => {
    if (!value) return allCountries.find((c) => c.isoCode === "ID");
    const digits = value.replace("+", "");
    const match = allCountries.find((c) => digits.startsWith(c.phoneCode));
    return match || allCountries.find((c) => c.isoCode === "ID");
  };

  const [selected, setSelected] = useState(getInitialCountry);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [phoneNumber, setPhoneNumber] = useState(() => {
    if (!value || !selected) return "";
    return value.replace("+" + selected.phoneCode, "");
  });

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const containerRef = useRef(null);

  const filtered = useMemo(() => {
    if (!query) return allCountries.slice(0, 8);
    const lower = query.toLowerCase();
    return allCountries
      .filter(
        (c) =>
          c.name.toLowerCase().includes(lower) ||
          c.phoneCode.includes(lower) ||
          c.isoCode.toLowerCase().includes(lower),
      )
      .slice(0, 8);
  }, [query, allCountries]);

  // Sync phone number when value changes externally
  useEffect(() => {
    if (!value) {
      setPhoneNumber("");
      return;
    }
    const country = getInitialCountry();
    if (country) {
      setSelected(country);
      setPhoneNumber(value.replace("+" + country.phoneCode, ""));
    }
  }, [value]);

  const emitChange = (country, number) => {
    const clean = number.replace(/[^0-9]/g, "");
    if (clean) {
      onChange("+" + country.phoneCode + clean);
    } else {
      onChange("");
    }
  };

  const selectCountry = (country) => {
    setSelected(country);
    setQuery("");
    setIsOpen(false);
    emitChange(country, phoneNumber);
  };

  const handleNumberChange = (e) => {
    const raw = e.target.value.replace(/[^0-9\s\-]/g, "");
    setPhoneNumber(raw);
    emitChange(selected, raw);
  };

  const handleClickOutside = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") setIsOpen(true);
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
          selectCountry(filtered[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [query]);

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex];
      if (item) item.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  return (
    <div>
      {label && (
        <label className="mb-1 block text-sm text-gray-600">{label}</label>
      )}
      <div className="flex">
        {/* Country Code Selector */}
        <div ref={containerRef} className="relative">
          <button
            type="button"
            onClick={() => !isOpen && setIsOpen(true)}
            className="flex h-full cursor-pointer items-center gap-1.5 border border-gray-300 bg-gray-50 px-3 py-2 text-sm hover:bg-gray-100"
          >
            <span>{selected?.flag}</span>
            <span className="text-gray-600">+{selected?.phoneCode}</span>
            <Icon
              icon="solar:alt-arrow-down-outline"
              className="ml-1 text-xs text-gray-400"
            />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 z-50 mt-1 w-64 border border-gray-200 bg-white shadow-lg">
              <div className="p-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setHighlightedIndex(-1);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search country..."
                  autoFocus
                  className="w-full border border-gray-300 px-2 py-1.5 text-sm focus:border-gray-500 focus:outline-none"
                />
              </div>
              <ul ref={listRef} className="max-h-48 overflow-auto">
                {filtered.map((country, index) => (
                  <li
                    key={country.isoCode}
                    onClick={() => selectCountry(country)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm ${
                      index === highlightedIndex
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    } ${
                      country.isoCode === selected?.isoCode ? "font-medium" : ""
                    }`}
                  >
                    <span>{country.flag}</span>
                    <span className="text-gray-600">+{country.phoneCode}</span>
                    <span className="text-gray-800">{country.name}</span>
                  </li>
                ))}
              </ul>
              {filtered.length === 0 && (
                <p className="px-3 py-2 text-sm text-gray-400">No results</p>
              )}
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={handleNumberChange}
          placeholder={placeholder}
          className="w-full border border-l-0 border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>
    </div>
  );
};

PhoneInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default PhoneInput;
