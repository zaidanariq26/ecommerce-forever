import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import Edit from "./pages/Edit";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Coupons from "./pages/Coupons";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
	const [token, setToken] = useState(localStorage.getItem("adminToken") || "");

	const handleSetToken = (newToken) => {
		setToken(newToken);
		if (newToken) {
			localStorage.setItem("adminToken", newToken);
		} else {
			localStorage.removeItem("adminToken");
		}
	};

	return (
		<div className="bg-gray-50 min-h-screen">
			<ToastContainer />
			{token === "" ? (
				<Login setToken={handleSetToken} />
			) : (
				<>
					<Navbar setToken={handleSetToken} />
					<hr />
					<div className="flex w-full">
						<Sidebar />
						<div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
							<Routes>
								<Route path="/add" element={<Add token={token} />} />
								<Route path="/edit" element={<Edit token={token} />} />
								<Route path="/list" element={<List token={token} />} />
								<Route path="/orders" element={<Orders token={token} />} />
							<Route path="/coupons" element={<Coupons token={token} />} />
							</Routes>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default App;
