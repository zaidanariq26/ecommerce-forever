import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";

const VARIANT_CONFIG = {
  default: {
    icon: "solar:bell-outline",
    iconBg: "bg-gray-50",
    iconColor: "text-gray-500",
    iconBorder: "text-gray-500",
    buttonBg: "bg-gray-800 hover:bg-gray-900",
  },
  info: {
    icon: "solar:info-circle-outline",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    iconBorder: "text-blue-300",
    buttonBg: "bg-blue-500 hover:bg-blue-600",
  },
  success: {
    icon: "solar:check-circle-outline",
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
    iconBorder: "text-green-300",
    buttonBg: "bg-green-500 hover:bg-green-600",
  },
  warning: {
    icon: "solar:danger-triangle-outline",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    iconBorder: "text-amber-300",
    buttonBg: "bg-amber-500 hover:bg-amber-600",
  },
  error: {
    icon: "solar:danger-circle-outline",
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    iconBorder: "text-red-300",
    buttonBg: "bg-red-500 hover:bg-red-600",
  },
};

const AlertDialog = ({
  isOpen,
  onClose,
  onConfirm,
  variant = "default",
  title,
  message,
  confirmLabel = "Ya, lanjutkan",
  cancelLabel = "Batal",
  hideCancel = false,
  closeOnBackdropClick = true,
  icon,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.default;

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
    } else {
      setIsAnimating(false);
      const timeout = setTimeout(() => setShouldRender(false), 100);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const handleBackdropClick = () => {
    if (closeOnBackdropClick) onClose();
  };

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-[2px] transition-opacity duration-100 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-xs bg-gray-100 px-7 pt-8 pb-6 text-center shadow-xl transition-all duration-100 sm:max-w-sm ${
          isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div
          className={`mx-auto mb-5 flex size-16 items-center justify-center rounded-full border ${config.iconBg} ${config.iconBorder}`}
        >
          <Icon
            icon={icon || config.icon}
            className={`text-3xl ${config.iconColor}`}
          />
        </div>

        <p className="mb-2 text-lg font-medium text-gray-800 sm:text-xl">
          {title}
        </p>
        <p className="mb-6 text-sm leading-relaxed font-normal text-gray-500">
          {message}
        </p>

        <button
          onClick={handleConfirm}
          className={`mb-2.5 w-full cursor-pointer py-3 text-sm text-gray-100 transition-colors ${config.buttonBg}`}
        >
          {confirmLabel}
        </button>

        {!hideCancel && (
          <button
            onClick={onClose}
            className="w-full cursor-pointer py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-200"
          >
            {cancelLabel}
          </button>
        )}
      </div>
    </div>,
    document.body,
  );
};

AlertDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  variant: PropTypes.oneOf(["default", "info", "success", "warning", "error"]),
  title: PropTypes.string,
  message: PropTypes.string,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  hideCancel: PropTypes.bool,
  closeOnBackdropClick: PropTypes.bool,
  icon: PropTypes.string,
};

export default AlertDialog;
