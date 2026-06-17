import Loading from "../Loading";
import PropTypes from "prop-types";

const SubmitButton = ({
  label = "Submit",
  type = "default",
  isLoading = false,
  className = "",
  onClick,
}) => {
  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={type === "loading" && isLoading}
      className={`h-10 w-full cursor-pointer font-light text-white ${
        type === "loading" && isLoading
          ? "pointer-events-none cursor-not-allowed bg-gray-800"
          : "bg-gray-900 hover:bg-gray-800"
      } ${className}`}
    >
      {type === "loading" && isLoading ? (
        <div className="flex items-center justify-center">
          <Loading type="spinner" color="text-gray-100" size="text-xl" />
        </div>
      ) : (
        label
      )}
    </button>
  );
};

SubmitButton.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["default", "loading"]),
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default SubmitButton;
