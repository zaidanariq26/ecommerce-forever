import api from "../api/axiosInstance";
import BestSeller from "../components/BestSeller";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import OurPolicy from "../components/OurPolicy";

const handleTes = async () => {
  try {
    const response = await api.get("/api/user/verify-email");
    console.log("Berhasil:", response);
  } catch (error) {
    console.log("Gagal (sudah lewat proses refresh tapi tetap gagal):", error);
  }
};

const Home = () => {
  return (
    <div>
      <Hero />
      <button onClick={handleTes} className="bg-gray-800 p-2 text-white">
        Tes
      </button>
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
    </div>
  );
};

export default Home;
