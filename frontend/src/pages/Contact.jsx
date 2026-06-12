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
          <p className="tegray500 text-xl font-semibold">Careers at Forever</p>
          <p className="text-gray-500">
            Learn more about our teams and jop openings.
          </p>
          <button className="border border-black px-8 py-4 text-sm transition-all duration-500 hover:bg-black hover:text-white">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
