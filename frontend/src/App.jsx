import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthInitializer from "./components/auth/AuthInitializer";
import { routes } from "./routes/routes";
import useAlertStore from "./zustand/alertStore";
import AlertDialog from "./components/ui/AlertDialog";

const App = () => {
  const alertConfig = useAlertStore((state) => state.alertConfig);
  const closeAlert = useAlertStore((state) => state.closeAlert);

  return (
    <AuthInitializer>
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:bg-gray-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white focus:outline-none"
        >
          Skip to content
        </a>
        <ToastContainer autoClose={3000} />
        <Navbar />
        <SearchBar />
        <main id="main-content" tabIndex={-1}>
          <Routes>
            {routes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
        </main>
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
