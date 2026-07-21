/* eslint-disable no-case-declarations */
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import api from "../api/axiosInstance";
import useAlertStore from "../zustand/alertStore";
import Loading from "../components/Loading";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const showAlert = useAlertStore((state) => state.showAlert);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const paymentMethods = [
    { id: "stripe", logo: assets.stripe_logo },
    { id: "razorpay", logo: assets.razorpay_logo },
    { id: "cod", label: "CASH ON DELIVERY" },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/api/user/profile");
        if (data.success) {
          const p = data.user;
          const addr = p.address || {};
          const isComplete =
            p.firstName?.trim() &&
            p.email?.trim() &&
            p.phone?.trim() &&
            addr.country?.trim() &&
            addr.state?.trim() &&
            addr.city?.trim() &&
            addr.zipcode?.trim();

          if (!isComplete) {
            showAlert({
              variant: "warning",
              title: "Complete Your Profile",
              message:
                "Please complete your profile (name, email, phone, and full address) before placing an order.",
              confirmLabel: "Go to Profile",
              hideCancel: true,
              onConfirm: () => navigate("/profile"),
            });
          } else {
            setProfile(p);
          }
        }
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, showAlert]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const subtotal = getCartAmount();
      const { data } = await api.post("/api/coupon/validate", {
        code: couponCode.trim(),
        subtotal,
      });
      if (data.success) {
        setAppliedCoupon(data.coupon);
        toast.success(`Coupon applied! ${data.coupon.discountPercent}% off`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid coupon");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info("Coupon removed");
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (res) => {
        console.log(res);
        try {
          const { data } = await api.post("/api/order/verifyRazorpay", res, {});
          if (data.success) {
            navigate("/orders");
            setCartItems({});
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async () => {
    if (!profile) return;

    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items),
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      const addr = profile.address || {};
      const orderData = {
        address: {
          firstName: profile.firstName,
          lastName: profile.lastName || "",
          email: profile.email,
          phone: profile.phone,
          street: addr.street || "",
          city: addr.city,
          state: addr.state,
          zipcode: addr.zipcode,
          country: addr.country,
        },
        items: orderItems,
        amount:
          getCartAmount() +
          delivery_fee -
          (appliedCoupon ? appliedCoupon.discount : 0),
        coupon: appliedCoupon
          ? {
              code: appliedCoupon.code,
              discountPercent: appliedCoupon.discountPercent,
              discount: appliedCoupon.discount,
            }
          : null,
      };

      switch (method) {
        case "cod":
          const response = await api.post("/api/order/place", orderData);
          if (response.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;

        case "stripe":
          const responseStripe = await api.post("/api/order/stripe", orderData);
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else toast.error(responseStripe.data.message);
          break;

        case "razorpay":
          const responseRazorpay = await api.post(
            "/api/order/razorpay",
            orderData,
            {},
          );
          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order);
          } else {
            console.log(responseRazorpay);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-10">
        <Loading type="spinner" size="text-4xl" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const addr = profile.address || {};

  return (
    <div className="flex min-h-[80v] flex-col justify-between gap-4 pt-8 md:flex-row md:pt-10">
      {/* ----- Left Side ----- */}
      <div>
        <div className="mb-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>

        <div className="rounded border border-gray-200 bg-gray-50 p-4 text-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-medium text-gray-800">
              {profile.firstName} {profile.lastName}
            </p>
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="cursor-pointer text-xs text-gray-500 underline hover:text-gray-800"
            >
              Edit Profile
            </button>
          </div>

          <div className="flex flex-col gap-2 text-gray-600">
            <p>{profile.email}</p>
            <p>{profile.phone}</p>
            {addr.street && <p>{addr.street}</p>}
            <p>
              {[addr.city, addr.state, addr.zipcode].filter(Boolean).join(", ")}
            </p>
            <p>{addr.country}</p>
          </div>
        </div>
      </div>

      {/* ----- Right Side ----- */}
      <div className="mt-6 md:mt-0">
        <div className="w-full">
          <CartTotal
            appliedCoupon={appliedCoupon}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            couponLoading={couponLoading}
          />
        </div>

        <div className="mt-8 md:mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />

          {/* ----- Payment Method Selection ----- */}
          <div className="flex flex-col gap-3 xl:flex-row">
            {paymentMethods.map(({ id, logo, label }) => (
              <div
                key={id}
                onClick={() => setMethod(id)}
                className="flex cursor-pointer items-center gap-3 border border-gray-400 p-2 px-3"
              >
                <p
                  className={`h-3.5 min-w-3.5 rounded-full border border-gray-400 ${method === id ? "bg-green-400" : ""}`}
                />
                {logo ? (
                  <img className="mx-4 h-5" src={logo} alt={id} />
                ) : (
                  <p className="mx-4 text-sm font-medium text-gray-500">
                    {label}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 w-full text-end">
            <button
              type="button"
              onClick={onSubmitHandler}
              className="xs:w-auto w-full cursor-pointer bg-gray-900 px-16 py-3 text-sm text-white hover:bg-gray-800"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
