import BestSeller from "../components/BestSeller";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import OurPolicy from "../components/OurPolicy";
import SEO from "../components/SEO";

const Home = () => {
  return (
    <div>
      <SEO title="Home" />
      <Hero />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
    </div>
  );
};

export default Home;
