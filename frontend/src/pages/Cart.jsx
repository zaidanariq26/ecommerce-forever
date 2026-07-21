import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  if (products.length > 0 && cartData.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-14">
        <Icon icon="solar:cart-outline" className="text-6xl text-gray-300" />
        <p className="text-xl text-gray-500">Your cart is empty</p>
        <Link
          to="/collection"
          className="mt-2 bg-gray-900 px-8 py-3 text-sm text-white hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 md:pt-10">
      <SEO title="Cart" />
      <div className="mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      <div className="divide-y divide-gray-300">
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id,
          );

          if (!productData) return null;

          return (
            <div
              key={index}
              className="items-center gap-4 border-gray-300 py-4 text-gray-700 first:border-t last:border-b"
            >
              <div className="flex items-start gap-4">
                <img
                  className="w-16 shrink-0 object-cover sm:w-20"
                  src={productData.image[0]}
                  alt={productData.name}
                />

                <div className="gap-x2 xs:gap-x-4 grid-rows-auto grid w-full grid-cols-[1fr_auto_auto] items-center gap-y-1 sm:grid-cols-[1fr_1fr_auto]">
                  {/* Product Detail */}
                  <p className="col-span-3 text-sm font-medium sm:text-base md:text-lg">
                    {productData.name}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="xs:text-base col-start-1 row-start-2 text-sm">
                      {currency}
                      {productData.price}
                    </div>

                    <div className="xs:hidden flex items-center gap-2 justify-self-start">
                      <span className="text-sm text-gray-400">Size</span>
                      <div className="xs:text-sm flex size-6 items-center justify-center border border-gray-300 bg-slate-50 text-xs">
                        <span>{item.size}</span>
                      </div>
                    </div>
                  </div>

                  <div className="xs:flex col-start-1 row-start-3 hidden items-center gap-2 justify-self-start">
                    <span className="text-sm text-gray-400">Size</span>
                    <div className="xs:text-sm flex size-6 items-center justify-center border border-gray-300 bg-slate-50 text-xs">
                      <span>{item.size}</span>
                    </div>
                  </div>

                  {/* Quantity Control */}
                  <div className="xs:gap-2 xs:col-start-2 xs:row-start-2 col-start-1 row-start-3 flex items-center gap-1 justify-self-start sm:justify-self-end md:justify-self-center">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.size, item.quantity - 1)
                      }
                      className="xs:size-8 flex size-6 cursor-pointer items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      <Icon
                        icon="ic:round-minus"
                        className="xs:text-xl text-sm"
                      />
                    </button>
                    <span className="xs:text-base w-5 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.size, item.quantity + 1)
                      }
                      className="xs:size-8 flex size-6 cursor-pointer items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      <Icon
                        icon="ic:round-plus"
                        className="xs:text-xl text-sm"
                      />
                    </button>
                  </div>

                  {/* Delete Item */}
                  <div className="xs:row-start-2 col-start-3 row-start-3 justify-self-end">
                    <Icon
                      onClick={() => updateQuantity(item._id, item.size, 0)}
                      icon="solar:trash-bin-trash-outline"
                      className="xs:text-3xl cursor-pointer text-xl text-gray-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end md:mt-8">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate("/place-order")}
              className="my-8 cursor-pointer bg-gray-900 px-8 py-3 text-sm text-white hover:bg-gray-800"
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
