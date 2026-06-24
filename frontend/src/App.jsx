import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthInitializer from "./components/auth/AuthInitializer";
import { routes } from "./routes/routes";
import SEO from "./components/SEO";

const App = () => {
  const location = useLocation();
  const currentRoute = routes.find((route) => route.path === location.pathname);

  return (
    <AuthInitializer>
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <SEO title={currentRoute?.title} />
        <ToastContainer autoClose={3000} />
        <Navbar />
        <SearchBar />
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
        <Footer />
      </div>
    </AuthInitializer>
  );
};

export default App;
