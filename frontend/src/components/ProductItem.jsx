/* eslint-disable react/prop-types */
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import useWishlistStore from "../zustand/wishlistStore";
import useAuthStore from "../zustand/authStore";

const ProductItem = ({
  id,
  name,
  image,
  price,
  rating = 0,
  numReviews = 0,
}) => {
  const { currency } = useContext(ShopContext);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const inWishlist = useWishlistStore((state) => state.wishlist.includes(id));

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    toggleWishlist(id);
  };

  return (
    <Link className="cursor-pointer text-gray-700" to={`/product/${id}`}>
      <div className="relative overflow-hidden">
        <img
          className="aspect-3/4 h-full object-cover object-center transition ease-in-out hover:scale-110"
          src={image[0]}
          alt="Product image"
        />
        {isAuthenticated && (
          <button
            onClick={handleWishlistToggle}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-2 right-2 cursor-pointer rounded-full bg-white/80 p-1.5 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
          >
            <Icon
              icon={inWishlist ? "solar:heart-bold" : "solar:heart-outline"}
              className={`text-lg ${inWishlist ? "text-red-500" : "text-gray-500"}`}
            />
          </button>
        )}
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      {rating > 0 && (
        <div className="mb-1 flex items-center gap-1">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon
                key={star}
                icon={
                  star <= Math.round(rating)
                    ? "solar:star-bold"
                    : "solar:star-outline"
                }
                className={
                  star <= Math.round(rating)
                    ? "text-sm text-amber-400"
                    : "text-sm text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">({numReviews})</span>
        </div>
      )}
      <p className="text-sm font-medium">
        {currency}
        {price}
      </p>
    </Link>
  );
};

export default ProductItem;
