import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("collection")) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  return showSearch && visible ? (
    <div className="flex items-center justify-center gap-3 border-b border-gray-300 bg-gray-50 text-center">
      <div className="xs:w-3/4 my-5 inline-flex w-full items-center justify-center rounded-full border border-gray-400 px-5 py-2 sm:w-1/2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-0 flex-1 bg-inherit text-sm outline-none"
          type="text"
          placeholder="Search"
        />
        <Icon
          icon="si:search-line"
          className="shrink-0 text-lg text-gray-600"
        />
      </div>

      <Icon
        onClick={() => setShowSearch(false)}
        icon="radix-icons:cross-2"
        className="shrink-0 cursor-pointer text-xl text-gray-600"
      />
    </div>
  ) : null;
};

export default SearchBar;
