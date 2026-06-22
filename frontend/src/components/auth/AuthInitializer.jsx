import { useEffect, useState } from "react";
import useAuthStore from "../../zustand/authStore";
import PropTypes from "prop-types";
import axios from "axios";

const AuthInitializer = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const silentRefresh = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/refresh-token`,
          {},
          { withCredentials: true },
        );

        if (response.data.success) {
          setAuth({
            user: response.data.user,
            accessToken: response.data.accessToken,
          });
        }
      } catch {
        // refresh token tidak ada/expired → user tetap dianggap belum login
      } finally {
        setIsInitializing(false);
      }
    };

    silentRefresh();
  }, []);

  // Tampilkan loading sebentar sampai proses cek auth selesai
  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return children;
};

AuthInitializer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthInitializer;
