import PropTypes from "prop-types";
import useAuthStore from "../zustand/authStore";
import { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";

const AuthLayout = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { navigate } = useContext(ShopContext);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="xs:min-h-[calc(100vh-82px)] flex min-h-[calc(100vh-73px)] items-center justify-center">
      {children}
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthLayout;
