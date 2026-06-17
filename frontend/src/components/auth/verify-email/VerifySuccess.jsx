import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import SubmitButton from "../../ui/SubmitButton";

const VerifySuccess = ({ countdown, onGoHome }) => {
  return (
    <div className="xs:max-w-96 flex w-full flex-col items-center text-gray-800">
      <div className="xs:size-18 flex size-16 items-center justify-center rounded-full bg-green-800">
        <Icon
          icon="solar:verified-check-outline"
          className="xs:text-4xl text-3xl text-gray-100"
        />
      </div>

      <p className="prata-regular xs:text-2xl mt-6 text-xl">Email Verified!</p>
      <p className="xs:text-base mt-2 text-center text-sm font-light text-gray-600">
        Your email has been verified successfully. Redirecting to homepage in
        {countdown}s...
      </p>

      <SubmitButton
        onClick={onGoHome}
        label="Go to Homepage"
        className="mt-8"
      />
    </div>
  );
};

VerifySuccess.propTypes = {
  countdown: PropTypes.number.isRequired,
  onGoHome: PropTypes.func,
};

export default VerifySuccess;
