import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

const SORT_OPTIONS = ["Relevant", "Price: Low to High", "Price: High to Low"];

const FILTER_ITEMS = [
  {
    key: "category",
    label: "CATEGORY",
    options: ["Men", "Women", "Kids"],
  },
  {
    key: "type",
    label: "TYPE",
    options: ["Topwear", "Bottomwear", "Winterwear"],
  },
];

const FilterModal = ({
  isOpen,
  onClose,
  onApply,
  selectedCategory = [],
  selectedType = [],
  selectedSortValue = "Relevant",
}) => {
  const [selectedSort, setSelectedSort] = useState(selectedSortValue);
  const [selectedFilters, setSelectedFilters] = useState({
    category: selectedCategory,
    type: selectedType,
  });

  useEffect(() => {
    if (!isOpen) return;

    setSelectedSort(selectedSortValue);
    setSelectedFilters({
      category: selectedCategory,
      type: selectedType,
    });
  }, [isOpen, selectedCategory, selectedSortValue, selectedType]);

  const toggleChip = (key, value) => {
    setSelectedFilters((prev) => {
      const current = prev[key];
      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const handleReset = () => {
    setSelectedSort("Relevant");
    setSelectedFilters({ category: [], type: [] });
  };

  const handleApply = () => {
    onApply({ sort: selectedSort, filters: selectedFilters });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} className="fixed inset-0 z-40 bg-black/40" />

      {/* Bottom Sheet */}
      <div className="fixed right-0 bottom-0 left-0 z-50 bg-white pb-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <p className="text-sm font-medium text-gray-900">Filter & Sort</p>
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <Icon icon="solar:close-circle-outline" height={22} />
            </button>
          </div>
        </div>

        <div className="px-5 pt-5">
          {/* Sort */}
          <p className="mb-3 text-xs font-medium tracking-widest text-gray-400">
            SORT BY
          </p>
          <div className="mb-6 flex flex-wrap gap-2">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedSort(option)}
                className={`rounded-full border px-4 py-1.5 text-xs transition-all ${
                  selectedSort === option
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 text-gray-700 hover:border-gray-500"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Filters */}
          {FILTER_ITEMS.map(({ key, label, options }) => (
            <div key={key} className="mb-6 border-t border-gray-100 pt-5">
              <p className="mb-3 text-xs font-medium tracking-widest text-gray-400">
                {label}
              </p>
              <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                  <button
                    key={option}
                    onClick={() => toggleChip(key, option)}
                    className={`rounded-full border px-4 py-1.5 text-xs transition-all ${
                      selectedFilters[key].includes(option)
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 text-gray-700 hover:border-gray-500"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Apply Button */}
          <button
            onClick={handleApply}
            className="w-full cursor-pointer bg-gray-900 py-3 text-sm text-white hover:bg-gray-800"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
};

FilterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  selectedCategory: PropTypes.arrayOf(PropTypes.string),
  selectedType: PropTypes.arrayOf(PropTypes.string),
  selectedSortValue: PropTypes.string,
};

export default FilterModal;
