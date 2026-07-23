import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BACKEND_URL, CURRENCY } from "../constants/index.js";
import { Icon } from "@iconify/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const RANGE_OPTIONS = [
  { label: "7 Days", days: 7 },
  { label: "30 Days", days: 30 },
  { label: "90 Days", days: 90 },
  { label: "All Time", days: null },
];

const STATUS_COLORS = {
  "Order Placed": "#3b82f6",
  Packing: "#f59e0b",
  Shipped: "#a855f7",
  "Out for Delivery": "#f97316",
  Delivered: "#22c55e",
};

const STATUS_BG = {
  "Order Placed": "bg-blue-100 text-blue-700",
  Packing: "bg-amber-100 text-amber-700",
  Shipped: "bg-purple-100 text-purple-700",
  "Out for Delivery": "bg-orange-100 text-orange-700",
  Delivered: "bg-green-100 text-green-700",
};

const Dashboard = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [range, setRange] = useState(30);

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

  // Filter orders by date range
  const filteredOrders = useMemo(() => {
    if (!range) return orders;
    const cutoff = Date.now() - range * 24 * 60 * 60 * 1000;
    return orders.filter((o) => o.date >= cutoff);
  }, [orders, range]);

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.amount, 0);
  const deliveredOrders = filteredOrders.filter((o) => o.status === "Delivered");
  const deliveredRevenue = deliveredOrders.reduce((sum, o) => sum + o.amount, 0);
  const pendingOrders = filteredOrders.filter((o) => o.status !== "Delivered");

  const statusCounts = filteredOrders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const recentOrders = [...filteredOrders]
    .sort((a, b) => b.date - a.date)
    .slice(0, 5);

  const productSales = {};
  filteredOrders.forEach((order) => {
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

  // Monthly revenue data for bar chart
  const monthlyRevenue = useMemo(() => {
    const months = {};
    filteredOrders.forEach((order) => {
      const d = new Date(order.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      if (!months[key]) months[key] = { key, label, revenue: 0 };
      months[key].revenue += order.amount;
    });
    return Object.values(months)
      .sort((a, b) => a.key.localeCompare(b.key))
      .slice(-12);
  }, [filteredOrders]);

  // Pie chart data
  const pieData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  return (
    <div className="space-y-6">
      {/* Header + Date Range Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setRange(opt.days)}
              className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                range === opt.days
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="solar:bag-outline"
          label="Total Orders"
          value={filteredOrders.length}
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
          sub={
            filteredOrders.length > 0
              ? `${((pendingOrders.length / filteredOrders.length) * 100).toFixed(0)}% of total`
              : "0% of total"
          }
          color="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Revenue Bar Chart + Status Pie Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-medium text-gray-800">Revenue Trend</h2>
          {monthlyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  formatter={(value) => [`${CURRENCY}${value.toFixed(2)}`, "Revenue"]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                    fontSize: "13px",
                  }}
                />
                <Bar dataKey="revenue" fill="#111827" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[280px] items-center justify-center">
              <p className="text-sm text-gray-400">No revenue data</p>
            </div>
          )}
        </div>

        {/* Status Pie Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-800">Orders by Status</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={STATUS_COLORS[entry.name] || "#9ca3af"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, name]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "13px",
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[280px] items-center justify-center">
              <p className="text-sm text-gray-400">No orders yet</p>
            </div>
          )}
          {/* Fallback badges */}
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <span
                key={status}
                className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_BG[status] || "bg-gray-100 text-gray-700"}`}
              >
                {status}: {count}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders + Top Selling */}
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
                <div className="shrink-0 flex items-center gap-2 sm:gap-3 ml-3">
                  <span
                    className={`hidden sm:inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BG[order.status] || "bg-gray-100 text-gray-700"}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
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
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-800">{name}</p>
                    <p className="text-xs text-gray-400">
                      {data.count} sold
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-sm font-medium text-gray-700 ml-3">
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
              filteredOrders.length > 0
                ? `${CURRENCY}${(totalRevenue / filteredOrders.length).toFixed(2)}`
                : `${CURRENCY}0.00`
            }
          />
        </div>
      </div>

      {/* Low Stock Alerts */}
      {products.filter((p) => p.stock <= 5).length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Icon icon="solar:danger-outline" className="text-lg text-amber-600" />
            <h2 className="text-lg font-medium text-amber-800">Low Stock Alerts</h2>
            <span className="ml-auto rounded-full bg-amber-200 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              {products.filter((p) => p.stock <= 5).length} items
            </span>
          </div>
          <div className="space-y-2">
            {products
              .filter((p) => p.stock <= 5)
              .sort((a, b) => a.stock - b.stock)
              .map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between rounded-lg bg-white px-4 py-2.5 border border-amber-200"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={product.image[0]}
                      alt=""
                      className="size-8 shrink-0 rounded object-cover"
                    />
                    <p className="truncate text-sm font-medium text-gray-800">
                      {product.name}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      product.stock <= 0
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {product.stock <= 0 ? "Out of stock" : `${product.stock} left`}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
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
