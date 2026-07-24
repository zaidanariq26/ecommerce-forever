import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Add from "./pages/Add";
import Edit from "./pages/Edit";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Coupons from "./pages/Coupons";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import useThemeStore, { applyDarkClass } from "./zustand/themeStore";

const App = () => {
	const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const location = useLocation();
	const dark = useThemeStore((s) => s.dark);

	useEffect(() => {
		applyDarkClass(dark);
	}, [dark]);

	const handleSetToken = (newToken) => {
		setToken(newToken);
		if (newToken) {
			localStorage.setItem("adminToken", newToken);
		} else {
			localStorage.removeItem("adminToken");
		}
	};

	return (
		<div className="min-h-screen overflow-x-hidden bg-gray-50 dark:bg-gray-950">
			<ToastContainer />
			{token === "" ? (
				<Login setToken={handleSetToken} />
			) : (
				<>
					<Navbar
						setToken={handleSetToken}
						token={token}
						onMenuToggle={() => setSidebarOpen((prev) => !prev)}
					/>
					<div className="flex">
						<Sidebar
							isOpen={sidebarOpen}
							onClose={() => setSidebarOpen(false)}
						/>
						<div className="flex-1 p-4 sm:p-6 lg:p-8">
							<ErrorBoundary key={location.pathname}>
								<Routes>
									<Route path="/" element={<Dashboard token={token} />} />
									<Route path="/add" element={<Add token={token} />} />
									<Route path="/edit" element={<Edit token={token} />} />
									<Route path="/list" element={<List token={token} />} />
									<Route path="/orders" element={<Orders token={token} />} />
									<Route path="/coupons" element={<Coupons token={token} />} />
								</Routes>
							</ErrorBoundary>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default App;
