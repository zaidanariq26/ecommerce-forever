/* eslint-disable react/prop-types */
const Title = ({ text1, text2 }) => {
  return (
    <div className="mb-3 inline-flex items-center gap-2">
      <p className="xs:text-2xl text-xl text-gray-500 md:text-3xl">
        {text1} <span className="font-medium text-gray-700">{text2}</span>
      </p>
      <p className="h-px w-8 bg-gray-700 sm:h-0.5 sm:w-12"></p>
    </div>
  );
};

export default Title;
