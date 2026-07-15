import { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import useWishlistStore from "../zustand/wishlistStore";
import useAuthStore from "../zustand/authStore";
import Loading from "../components/Loading";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const Wishlist = () => {
  const { products } = useContext(ShopContext);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { wishlist, loaded, fetchWishlist } = useWishlistStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, fetchWishlist]);

  const wishlistProducts = products.filter((p) => wishlist.includes(p._id));

  return (
    <div className="min-h-screen pt-8 md:pt-10">
      <SEO title="Wishlist" />
      <div className="mb-3 text-center">
        <Title text1={"MY"} text2={"WISHLIST"} />
      </div>

      {!isAuthenticated ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <Icon icon="solar:heart-outline" className="text-6xl text-gray-300" />
          <p className="text-xl text-gray-500">
            Please login to view your wishlist
          </p>
          <Link
            to="/login"
            className="mt-2 bg-gray-900 px-8 py-3 text-sm text-white hover:bg-gray-800"
          >
            Login
          </Link>
        </div>
      ) : !loaded ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loading type="spinner" size="text-4xl" />
        </div>
      ) : wishlistProducts.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <Icon icon="solar:heart-outline" className="text-6xl text-gray-300" />
          <p className="text-xl text-gray-500">Your wishlist is empty</p>
          <Link
            to="/collection"
            className="mt-2 bg-gray-900 px-8 py-3 text-sm text-white hover:bg-gray-800"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {wishlistProducts.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
              rating={item.rating}
              numReviews={item.numReviews}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
