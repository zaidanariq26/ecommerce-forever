import { Icon } from "@iconify/react";
import SubmitButton from "../../ui/SubmitButton";
import { useState } from "react";

const VerifyError = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="xs:max-w-96 flex w-full flex-col items-center text-gray-800">
      <div className="xs:size-18 flex size-16 items-center justify-center rounded-full bg-red-800">
        <Icon
          icon="radix-icons:cross-2"
          className="xs:text-4xl text-3xl text-gray-100"
        />
      </div>

      <p className="prata-regular xs:text-2xl mt-6 text-xl">
        Link Invalid or Expired
      </p>
      <p className="xs:text-base mt-2 text-center text-sm font-light text-gray-600">
        This verification link is no longer valid. Please request a new one.
      </p>

      <SubmitButton
        className="mt-8"
        label="Resend Verification Email"
        type="loading"
        isLoading={loading}
      />
    </div>
  );
};

export default VerifyError;
