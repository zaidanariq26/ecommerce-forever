import Title from "../components/Title";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div>
      <div className="pt-10 text-center text-2xl">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>

      <div className="my-10 mb-28 flex flex-col justify-center gap-10 md:flex-row">
        <img
          src={assets.contact_img}
          className="w-full md:max-w-[480px]"
          alt=""
        />
        <div className="flex flex-col items-center justify-center gap-6">
          <p className="text-xl font-semibold text-gray-600">Our Store</p>
          <p className="text-gray-500">
            565656 Willms Station <br /> Suite 765, Washington, USA
          </p>
          <p className="text-gray-500">
            Tel: (324) 333-324 <br /> Email: admin@forever.com
          </p>
          <p className="text-xl font-semibold text-gray-600">Customer Care</p>
          <p className="max-w-md text-center text-gray-500">
            Need help with sizing, delivery, returns, or your order? Send us a
            message and we will help you shop with confidence.
          </p>
          <button className="border border-black px-8 py-4 text-sm transition-all duration-500 hover:bg-gray-900 hover:text-white">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
