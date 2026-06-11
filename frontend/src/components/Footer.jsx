import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div>
      <div className="my-10 mt-40 flex grid-cols-[3fr_1fr_1fr] flex-col gap-14 text-sm sm:grid">
        <div>
          <img src={assets.logo} className="mb-5 w-32" alt="" />
          <p className="w-full text-gray-600 md:w-2/3">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem in
            distinctio provident voluptate eligendi accusantium?
          </p>
        </div>

        <div>
          <p className="mb-5 text-xl font-medium">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div>
          <p className="mb-5 text-xl font-medium">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+1-212-456-7890</li>
            <li>contact@foreveryou.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr className="text-gray-300" />
        <p className="py-5 text-center text-sm">
          Copyright 2024@ forever.com - All Right Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
