import PropTypes from "prop-types";
import { Icon } from "@iconify/react";

const STEPS = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const OrderTimeline = ({ statusHistory = [], currentStatus }) => {
  const historyMap = {};
  statusHistory.forEach((entry) => {
    historyMap[entry.status] = entry.date;
  });

  const currentStepIndex = STEPS.indexOf(currentStatus);

  return (
    <div className="flex flex-col gap-0">
      {STEPS.map((step, index) => {
        const isCompleted = index <= currentStepIndex;
        const isCurrent = step === currentStatus;
        const hasHistory = !!historyMap[step];

        return (
          <div key={step} className="group/item flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 ${
                  isCompleted
                    ? "border-green-500 bg-green-500"
                    : "border-gray-300 bg-white"
                }`}
              >
                {isCompleted ? (
                  <Icon
                    icon="solar:check-read-outline"
                    className="text-sm text-white"
                  />
                ) : (
                  <span className="text-xs text-gray-400">{index + 1}</span>
                )}
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={`w-0.5 flex-1 ${
                    index < currentStepIndex ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>

            <div className="flex-1 pt-0.5 pb-5 group-last/item:pb-0">
              <p
                className={`text-sm ${
                  isCurrent
                    ? "font-semibold text-gray-900"
                    : isCompleted
                      ? "font-medium text-gray-700"
                      : "text-gray-400"
                }`}
              >
                {step}
                {isCurrent && (
                  <span className="ml-2 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    Current
                  </span>
                )}
              </p>
              {hasHistory && (
                <p className="mt-0.5 text-xs text-gray-400">
                  {formatDate(historyMap[step])} at{" "}
                  {formatTime(historyMap[step])}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

OrderTimeline.propTypes = {
  statusHistory: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string.isRequired,
      date: PropTypes.number.isRequired,
    }),
  ),
  currentStatus: PropTypes.string.isRequired,
};

export default OrderTimeline;
