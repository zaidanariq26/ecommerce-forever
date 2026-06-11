import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const About = () => {
  return (
    <div>
      <div className="pt-8 text-center text-2xl">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col gap-16 md:flex-row">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.about_img}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 text-gray-600 md:w-2/4">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores
            pariatur recusandae itaque sunt voluptatem corrupti minima molestias
            voluptates voluptas sit, totam veniam! Repellendus aliquid dicta
            nisi rem esse aperiam perspiciatis! Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Aperiam tempore atque ut commodi,
            doloremque ex illo. Consectetur distinctio debitis ducimus?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
            exercitationem ipsam vero molestias atque consectetur. Corrupti
            commodi mollitia magnam adipisci.
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Mollitia
            modi et nisi at laboriosam enim suscipit eum sapiente aut. Commodi!
          </p>
        </div>
      </div>

      <div className="py-4 text-xl">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>

      <div className="mb-20 flex flex-col divide-y divide-gray-300 border border-gray-300 text-sm md:flex-row md:divide-x">
        <div className="flex flex-col gap-5 px-10 py-8 sm:py-20 md:px-16">
          <b>Quality Assurance: </b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit id,
            doloribus maxime iure sint minima.
          </p>
        </div>
        <div className="flex flex-col gap-5 px-10 py-8 sm:py-20 md:px-16">
          <b>Convenience: </b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit id,
            doloribus maxime iure sint minima.
          </p>
        </div>
        <div className="flex flex-col gap-5 px-10 py-8 sm:py-20 md:px-16">
          <b>Exeptional Customer Service: </b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit id,
            doloribus maxime iure sint minima.
          </p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;
