import Title from "../components/Title";
import { assets } from "../assets/assets";
import SEO from "../components/SEO";

const About = () => {
  return (
    <div>
      <SEO title="About Us" />
      <div className="pt-10 text-center">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="mt-6 flex flex-col gap-12 sm:mt-10 sm:gap-16 md:flex-row">
        <img
          className="w-full object-cover object-center md:max-w-112.5"
          src={assets.about_img}
          alt="About Forever store"
        />
        <div className="flex flex-col justify-center gap-6 text-gray-600 md:w-2/4">
          <p>
            Forever is built for everyday style that feels effortless, polished,
            and easy to wear. We curate wardrobe essentials for men, women, and
            kids with a focus on clean silhouettes, comfortable fabrics, and
            pieces that can move with your routine.
          </p>
          <p>
            From relaxed basics to standout seasonal picks, our collection is
            designed to help you build outfits with confidence. We keep the
            shopping experience simple, the product details clear, and the
            checkout flow smooth from cart to doorstep.
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            Our mission is to make dependable fashion more accessible: styles
            that look good, feel comfortable, and fit naturally into real life.
          </p>
        </div>
      </div>

      <div className="mt-6 py-4 sm:mt-10">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>

      <div className="mb-20 flex flex-col divide-y divide-gray-300 border border-gray-300 text-sm sm:flex-row sm:divide-x">
        <div className="flex flex-col gap-5 px-10 py-8 sm:py-12 md:px-8">
          <b>Quality Assurance: </b>
          <p className="text-gray-600">
            Every product is selected with attention to fabric, fit, and finish
            so your order feels as good in person as it looks online.
          </p>
        </div>
        <div className="flex flex-col gap-5 px-10 py-8 sm:py-12 md:px-8">
          <b>Convenience: </b>
          <p className="text-gray-600">
            Browse by category, compare styles, choose your size, and complete
            checkout with a flow designed to stay quick and simple.
          </p>
        </div>
        <div className="flex flex-col gap-5 px-10 py-8 sm:py-12 md:px-8">
          <b>Exceptional Customer Service: </b>
          <p className="text-gray-600">
            We keep support friendly and responsive, from order questions to
            returns, exchanges, and delivery updates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
