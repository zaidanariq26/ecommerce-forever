import PropTypes from "prop-types";

const AuthLayout = ({ children }) => {
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
