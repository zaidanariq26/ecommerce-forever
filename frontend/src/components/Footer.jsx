import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { navLinks } from "../constant";

const Footer = () => {
  return (
    <div>
      <div className="my-10 flex grid-cols-[3fr_1fr_1fr] flex-col gap-14 text-sm sm:grid">
        <div>
          <img src={assets.logo} className="mb-5 w-32" alt="" />
          <p className="w-full text-gray-600 md:w-2/3">
            Forever brings together clean everyday fashion, simple shopping, and
            reliable service so you can find pieces that fit your life with
            ease.
          </p>
        </div>

        <div>
          <p className="mb-5 text-xl font-medium">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            {navLinks.map((navLink, index) => (
              <Link key={index} to={navLink.path}>
                <span className="hover:underline">{navLink.name}</span>
              </Link>
            ))}
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
        <p className="py-5 text-center text-sm text-gray-800">
          ©2026 forever.com - All Right Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
