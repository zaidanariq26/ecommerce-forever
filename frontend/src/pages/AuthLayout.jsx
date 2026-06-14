import PropTypes from "prop-types";

const AuthLayout = ({ children }) => {
  return (
    <div className="xs:-mt-20.5 -mt-18.25 flex min-h-screen items-center justify-center">
      {children}
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthLayout;
