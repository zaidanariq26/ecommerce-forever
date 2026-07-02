import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthInitializer from "./components/auth/AuthInitializer";
import { routes } from "./routes/routes";
import SEO from "./components/SEO";
import useAlertStore from "./zustand/alertStore";
import AlertDialog from "./components/ui/AlertDialog";

const App = () => {
  const location = useLocation();
  const currentRoute = routes.find((route) => route.path === location.pathname);

  const alertConfig = useAlertStore((state) => state.alertConfig);
  const closeAlert = useAlertStore((state) => state.closeAlert);

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

      <AlertDialog
        isOpen={!!alertConfig}
        onClose={closeAlert}
        onConfirm={alertConfig?.onConfirm}
        variant={alertConfig?.variant}
        title={alertConfig?.title}
        message={alertConfig?.message}
        confirmLabel={alertConfig?.confirmLabel}
        closeOnBackdropClick={alertConfig?.closeOnBackdropClick}
        hideCancel={alertConfig?.hideCancel}
      />
    </AuthInitializer>
  );
};

export default App;
