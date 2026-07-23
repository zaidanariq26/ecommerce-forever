import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL, CURRENCY } from "../constants/index.js";
import { Icon } from "@iconify/react";

const Dashboard = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          axios.post(BACKEND_URL + "/api/order/list", {}, { headers: { token } }),
          axios.get(BACKEND_URL + "/api/product/list"),
        ]);
        if (ordersRes.data.success) setOrders(ordersRes.data.orders);
        if (productsRes.data.success) setProducts(productsRes.data.products);
      } catch (error) {
        console.error(error);
      }
    };
    if (token) fetchData();
  }, [token]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const deliveredOrders = orders.filter((o) => o.status === "Delivered");
  const deliveredRevenue = deliveredOrders.reduce((sum, o) => sum + o.amount, 0);
  const pendingOrders = orders.filter((o) => o.status !== "Delivered");

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const recentOrders = [...orders]
    .sort((a, b) => b.date - a.date)
    .slice(0, 5);

  const productSales = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productSales[item.name]) {
        productSales[item.name] = { count: 0, revenue: 0 };
      }
      productSales[item.name].count += item.quantity;
      productSales[item.name].revenue += item.price * item.quantity;
    });
  });
  const topSelling = Object.entries(productSales)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  const statusColors = {
    "Order Placed": "bg-blue-100 text-blue-700",
    Packing: "bg-amber-100 text-amber-700",
    Shipped: "bg-purple-100 text-purple-700",
    "Out for Delivery": "bg-orange-100 text-orange-700",
    Delivered: "bg-green-100 text-green-700",
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="solar:bag-outline"
          label="Total Orders"
          value={orders.length}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon="solar:dollar-bold"
          label="Total Revenue"
          value={`${CURRENCY}${totalRevenue.toFixed(2)}`}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          icon="solar:check-circle-outline"
          label="Delivered"
          value={deliveredOrders.length}
          sub={`${CURRENCY}${deliveredRevenue.toFixed(2)} revenue`}
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon="solar:clock-outline"
          label="Pending"
          value={pendingOrders.length}
          sub={`${orders.length > 0 ? ((pendingOrders.length / orders.length) * 100).toFixed(0) : 0}% of total`}
          color="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Status Breakdown */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-medium text-gray-800">Orders by Status</h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(statusCounts).map(([status, count]) => (
            <span
              key={status}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${statusColors[status] || "bg-gray-100 text-gray-700"}`}
            >
              {status}: {count}
            </span>
          ))}
          {Object.keys(statusCounts).length === 0 && (
            <p className="text-sm text-gray-400">No orders yet</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-800">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {order.items.map((i) => i.name).join(", ")}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="ml-4 flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {CURRENCY}{order.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <p className="text-sm text-gray-400">No orders yet</p>
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-800">Top Selling Products</h2>
          <div className="space-y-3">
            {topSelling.map(([name, data], i) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">{name}</p>
                    <p className="text-xs text-gray-400">
                      {data.count} sold
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {CURRENCY}{data.revenue.toFixed(2)}
                </span>
              </div>
            ))}
            {topSelling.length === 0 && (
              <p className="text-sm text-gray-400">No sales data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-medium text-gray-800">Quick Stats</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <QuickStat label="Total Products" value={products.length} />
          <QuickStat
            label="Bestsellers"
            value={products.filter((p) => p.bestseller).length}
          />
          <QuickStat
            label="Avg. Order Value"
            value={
              orders.length > 0
                ? `${CURRENCY}${(totalRevenue / orders.length).toFixed(2)}`
                : `${CURRENCY}0.00`
            }
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
    <div className={`flex size-12 items-center justify-center rounded-full ${color}`}>
      <Icon icon={icon} className="text-xl" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-semibold text-gray-800">{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  </div>
);

const QuickStat = ({ label, value }) => (
  <div className="rounded-lg bg-gray-50 p-4 text-center">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-lg font-semibold text-gray-800">{value}</p>
  </div>
);

export default Dashboard;
