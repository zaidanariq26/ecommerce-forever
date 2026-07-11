import { Icon } from "@iconify/react";
import Loading from "../../Loading";

const VerifyEmail = () => {
  return (
    <div className="xs:max-w-96 flex w-full flex-col items-center text-gray-800">
      <div className="xs:size-18 flex size-16 items-center justify-center rounded-full bg-gray-800">
        <Icon
          icon="mynaui:envelope"
          className="xs:text-4xl text-3xl text-gray-100"
        />
      </div>

      <p className="prata-regular xs:text-2xl mt-6 text-xl">
        Verifying Your Email
      </p>
      <p className="xs:text-base mt-2 text-center text-sm font-light text-gray-600">
        Please wait a moment while we verify your email address...
      </p>

      <div className="mt-8 flex items-center justify-center">
        <Loading type="dots" size="text-4xl" />
      </div>
    </div>
  );
};

export default VerifyEmail;
