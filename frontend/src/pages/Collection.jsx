import { useCallback, useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { Icon } from "@iconify/react";
import FilterModal from "../components/FilterModal";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [filterOpen, setFilterOpen] = useState(false);

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

  // useEffect(() => {
  //    setFilterProducts(products);
  // }, []);

  useEffect(() => {
    applyFilterAndSort();
  }, [applyFilterAndSort]);

  return (
    <div className="flex flex-col gap-1 pt-10 sm:flex-row sm:gap-10">
      {/* Filter Options */}
      <div className="hidden min-w-60 min-[864px]:block">
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
        <div className="mb-4 flex justify-between text-base sm:text-2xl">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          {/* Product Sort */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="hidden border-2 border-gray-300 px-2 text-sm min-[864px]:block"
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
            className="inline cursor-pointer border border-gray-400 p-2 hover:bg-gray-200 min-[864px]:hidden"
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
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
