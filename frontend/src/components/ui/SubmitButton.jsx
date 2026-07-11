import Loading from "../Loading";
import PropTypes from "prop-types";

const SubmitButton = ({
  label = "Submit",
  type = "default",
  isLoading = false,
  className = "",
  onClick,
  disabled,
}) => {
  const isDisabled = (type === "loading" && isLoading) || disabled;

  const baseStyle = "h-10 w-full";
  const activeStyle =
    "bg-gray-900 hover:bg-gray-800 text-gray-100 cursor-pointer";
  const disabledStyle = " cursor-not-allowed bg-gray-800 text-gray-400";

  const buttonStyle = `${baseStyle} ${isDisabled ? disabledStyle : activeStyle} ${className}`;
  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={isDisabled}
      className={buttonStyle}
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
  disabled: PropTypes.bool,
};

export default SubmitButton;
