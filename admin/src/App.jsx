import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
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

const App = () => {
	const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const handleSetToken = (newToken) => {
		setToken(newToken);
		if (newToken) {
			localStorage.setItem("adminToken", newToken);
		} else {
			localStorage.removeItem("adminToken");
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
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
							<ErrorBoundary>
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
