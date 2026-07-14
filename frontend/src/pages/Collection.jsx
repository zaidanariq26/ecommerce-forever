import { useCallback, useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { Icon } from "@iconify/react";
import FilterModal from "../components/FilterModal";
import SEO from "../components/SEO";

const ITEMS_PER_PAGE = 8;

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [filterOpen, setFilterOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilterAndSort = useCallback(() => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category),
      );
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory),
      );
    }

    switch (sortType) {
      case "low-high":
        productsCopy.sort((a, b) => a.price - b.price);
        break;

      case "high-low":
        productsCopy.sort((a, b) => b.price - a.price);
        break;

      case "newest":
        productsCopy.sort((a, b) => b.date - a.date);
        break;

      default:
        break;
    }

    setFilterProducts(productsCopy);
  }, [category, products, search, showSearch, sortType, subCategory]);

  const filterItems = [
    {
      key: "category",
      label: "CATEGORY",
      options: ["Men", "Women", "Kids"],
      onChange: toggleCategory,
    },
    {
      key: "type",
      label: "TYPE",
      options: ["Topwear", "Bottomwear", "Winterwear"],
      onChange: toggleSubCategory,
    },
  ];

  const sortLabelMap = {
    relevant: "Relevant",
    "low-high": "Price: Low to High",
    "high-low": "Price: High to Low",
    newest: "Newest",
  };

  const handleApply = ({ sort, filters }) => {
    const sortMap = {
      Relevant: "relevant",
      "Price: Low to High": "low-high",
      "Price: High to Low": "high-low",
      Newest: "newest",
    };

    setCategory(filters.category);
    setSubCategory(filters.type);
    setSortType(sortMap[sort] || "relevant");
  };

  useEffect(() => {
    applyFilterAndSort();
    setCurrentPage(1);
    if (initialLoading && products.length > 0) {
      setInitialLoading(false);
    }
  }, [applyFilterAndSort, initialLoading, products.length]);

  return (
    <div className="mb-28 flex flex-col gap-1 pt-10 sm:flex-row sm:gap-10">
      <SEO title="Collection" />
      {/* Filter Options */}
      <div className="hidden min-w-60 min-[964px]:block">
        <p className="my-2 flex items-center gap-2 text-xl">FILTERS</p>
        {/* Category Filter */}
        {filterItems.map(({ key, label, options, onChange }) => (
          <div key={key} className="mt-6 border border-gray-300 py-3 pl-5">
            <p className="mb-3 text-sm font-medium">{label}</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              {options.map((item) => (
                <label key={item} htmlFor={item} className="flex gap-2">
                  <input
                    id={item}
                    type="checkbox"
                    className="w-3"
                    value={item}
                    checked={
                      key === "category"
                        ? category.includes(item)
                        : subCategory.includes(item)
                    }
                    onChange={onChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Right */}
      <div className="flex-1">
        <div className="mb-4 flex justify-between">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          {/* Product Sort */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="hidden border-2 border-gray-300 px-2 text-sm min-[964px]:block"
            name=""
            id=""
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>

          <button
            onClick={() => setFilterOpen(true)}
            type="button"
            aria-label="Open filters"
            className="flex size-10 cursor-pointer items-center justify-center border border-gray-400 hover:bg-gray-200 min-[964px]:hidden"
          >
            <Icon
              icon="solar:filter-outline"
              cursor="pointer"
              className="text-lg text-gray-800"
            />
          </button>

          <FilterModal
            isOpen={filterOpen}
            onClose={() => setFilterOpen(false)}
            onApply={handleApply}
            selectedCategory={category}
            selectedType={subCategory}
            selectedSortValue={sortLabelMap[sortType] || "Relevant"}
          />
        </div>

        {/* Map Products */}
        <div className="grid grid-cols-2 gap-4 gap-y-6 md:grid-cols-3 lg:grid-cols-4">
          {filterProducts.length > 0 ? (
            filterProducts
              .slice(
                (currentPage - 1) * ITEMS_PER_PAGE,
                currentPage * ITEMS_PER_PAGE,
              )
              .map((item, index) => (
                <ProductItem
                  key={item._id}
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                  rating={item.rating}
                  numReviews={item.numReviews}
                />
              ))
          ) : !initialLoading ? (
            <div className="col-span-full flex min-h-[40vh] flex-col items-center justify-center gap-4">
              <Icon
                icon="solar:magnifer-outline"
                className="text-6xl text-gray-300"
              />
              <p className="text-xl text-gray-500">No products found</p>
            </div>
          ) : null}
        </div>

        {/* Pagination */}
        {filterProducts.length > ITEMS_PER_PAGE && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="cursor-pointer border border-gray-300 px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            {/* Mobile: page indicator */}
            <span className="text-sm text-gray-600 sm:hidden">
              {currentPage} /{" "}
              {Math.ceil(filterProducts.length / ITEMS_PER_PAGE)}
            </span>
            {/* Desktop: page numbers */}
            {Array.from(
              { length: Math.ceil(filterProducts.length / ITEMS_PER_PAGE) },
              (_, i) => i + 1,
            ).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`hidden cursor-pointer border px-3 py-1 text-sm sm:inline-block ${
                  currentPage === page
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(
                    Math.ceil(filterProducts.length / ITEMS_PER_PAGE),
                    p + 1,
                  ),
                )
              }
              disabled={
                currentPage ===
                Math.ceil(filterProducts.length / ITEMS_PER_PAGE)
              }
              className="cursor-pointer border border-gray-300 px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
