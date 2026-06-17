import { Icon } from "@iconify/react";
import PropTypes from "prop-types";

const loadingElements = {
  dots: "svg-spinners:3-dots-bounce",
  spinner: "svg-spinners:270-ring-with-bg",
};

const Loading = ({
  color = "text-gray-800",
  type = "dots",
  size = "text-base",
}) => {
  return <Icon icon={loadingElements[type]} className={`${color} ${size}`} />;
};

Loading.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string,
  type: PropTypes.oneOf(["dots", "spinner"]),
};

export default Loading;
