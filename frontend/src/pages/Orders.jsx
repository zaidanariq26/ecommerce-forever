import { useCallback, useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import useAuthStore from "../zustand/authStore";
import api from "../api/axiosInstance";
import Loading from "../components/Loading";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import ReviewModal from "../components/ReviewModal";

const Orders = () => {
  const { currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Review state
  const [reviewableMap, setReviewableMap] = useState({});
  const [reviewModal, setReviewModal] = useState(null);

  const loadOrderData = useCallback(async () => {
    try {
      if (!isAuthenticated) return null;

      const response = await api.post("/api/order/userorders", {});

      if (response.data.success) {
        let allOrdersItem = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              orderId: order._id,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            });
          });
        });

        setOrderData(allOrdersItem.reverse());

        // Fetch reviewable status for delivered orders
        const deliveredOrders = response.data.orders.filter(
          (order) => order.status === "Delivered",
        );
        const newReviewableMap = {};

        await Promise.all(
          deliveredOrders.map(async (order) => {
            try {
              const res = await api.post("/api/review/reviewable", {
                orderId: order._id,
              });
              if (res.data.success) {
                res.data.items.forEach((item) => {
                  newReviewableMap[`${order._id}-${item.productId}`] = item;
                });
              }
            } catch (error) {
              console.log(error);
            }
          }),
        );

        setReviewableMap(newReviewableMap);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadOrderData();
  }, [isAuthenticated, loadOrderData]);

  const handleReviewSubmit = () => {
    loadOrderData();
  };

  return (
    <div className="min-h-screen pt-14">
      <SEO title="My Orders" />
      <div className="mb-3">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loading type="spinner" size="text-4xl" />
        </div>
      ) : orderData.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <Icon icon="solar:box-outline" className="text-6xl text-gray-300" />
          <p className="text-xl text-gray-500">No orders yet</p>
          <Link
            to="/collection"
            className="mt-2 bg-gray-900 px-8 py-3 text-sm text-white hover:bg-gray-800"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-300">
          {orderData.map((item, index) => {
            const reviewKey = `${item.orderId}-${item._id}`;
            const reviewable = reviewableMap[reviewKey];
            const isDelivered = item.status === "Delivered";

            return (
              <div
                className="flex flex-col gap-4 border-gray-300 py-4 text-gray-700 first:border-t last:border-b md:flex-row md:items-center md:justify-between"
                key={index}
              >
                <div className="flex items-start gap-6">
                  <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <div className="mt-1 flex items-center gap-3 text-base text-gray-700">
                      <p className="text-sm sm:text-base">
                        {currency}
                        {item.price}
                      </p>
                      <p className="text-sm sm:text-base">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm sm:text-base">Size: {item.size}</p>
                    </div>
                    <p className="mt-1 text-sm sm:text-base">
                      Date:{" "}
                      <span className="text-gray-400">
                        {new Date(item.date).toDateString()}
                      </span>
                    </p>
                    <p className="mt-1 text-sm sm:text-base">
                      Payment:{" "}
                      <span className="text-gray-400">{item.paymentMethod}</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2 md:w-1/2 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2">
                    <p className="h-2 min-w-2 rounded-full bg-green-500"></p>
                    <p className="text-sm md:text-base">{item.status}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {isDelivered && reviewable && (
                      <>
                        {reviewable.reviewed ? (
                          <button
                            onClick={() =>
                              setReviewModal({
                                productId: item._id,
                                orderId: item.orderId,
                                productName: item.name,
                                existingReview: reviewable.review,
                              })
                            }
                            className="flex cursor-pointer gap-0.5"
                            title="Click to edit review"
                          >
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Icon
                                key={star}
                                icon={
                                  star <= reviewable.review.rating
                                    ? "solar:star-bold"
                                    : "solar:star-outline"
                                }
                                className={
                                  star <= reviewable.review.rating
                                    ? "text-amber-400 text-sm"
                                    : "text-gray-300 text-sm"
                                }
                              />
                            ))}
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              setReviewModal({
                                productId: item._id,
                                orderId: item.orderId,
                                productName: item.name,
                                existingReview: null,
                              })
                            }
                            className="cursor-pointer rounded-sm border border-gray-900 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
                          >
                            Write Review
                          </button>
                        )}
                      </>
                    )}
                    {!isDelivered && (
                      <button
                        onClick={loadOrderData}
                        className="cursor-pointer rounded-sm border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-200"
                      >
                        Track Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {reviewModal && (
        <ReviewModal
          isOpen={!!reviewModal}
          onClose={() => setReviewModal(null)}
          productId={reviewModal.productId}
          orderId={reviewModal.orderId}
          productName={reviewModal.productName}
          existingReview={reviewModal.existingReview}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
};

export default Orders;
