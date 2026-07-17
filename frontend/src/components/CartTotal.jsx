import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = ({
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  couponCode,
  setCouponCode,
  couponLoading,
}) => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  const subtotal = getCartAmount();
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const total =
    subtotal === 0 ? 0 : Math.max(0, subtotal + delivery_fee - discount);

  return (
    <div className="w-full">
      <div>
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      <div className="mt-2 flex w-full flex-col justify-between gap-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency} {Number(subtotal).toFixed(2)}
          </p>
        </div>
        <hr className="border-gray-300" />
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>
            {currency} {Number(delivery_fee).toFixed(2)}
          </p>
        </div>

        {appliedCoupon && (
          <>
            <hr className="border-gray-300" />
            <div className="flex justify-between text-green-600">
              <p>Discount ({appliedCoupon.discountPercent}%)</p>
              <p>
                -{currency} {discount.toFixed(2)}
              </p>
            </div>
          </>
        )}

        <hr className="border-gray-300" />
        <div className="flex justify-between font-medium">
          <p>Total</p>
          <p>
            {currency} {total.toFixed(2)}
          </p>
        </div>
      </div>

      {onApplyCoupon && (
        <div className="mt-4">
          {appliedCoupon ? (
            <div className="flex items-center justify-between rounded border border-green-300 bg-green-50 px-3 py-2 text-sm">
              <span className="font-medium text-green-700">
                {appliedCoupon.code} — {appliedCoupon.discountPercent}% off
              </span>
              <button
                type="button"
                onClick={onRemoveCoupon}
                className="cursor-pointer text-gray-500 hover:text-red-500"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Coupon code"
                className="min-w-0 flex-1 border border-gray-300 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={onApplyCoupon}
                disabled={couponLoading || !couponCode.trim()}
                className="cursor-pointer bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {couponLoading ? "..." : "Apply"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartTotal;
