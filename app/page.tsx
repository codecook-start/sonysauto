import HomeCarousel from "@/app/_HomeCarousel";
import Footer from "@/app/_Footer";
import Header from "@/app/_Header";
import { EmblaOptionsType } from "embla-carousel";
import { Toaster } from "@/components/ui/toaster";
const OPTIONS: EmblaOptionsType = { loop: true };

const Home = () => {
  return (
    <div className="absolute left-0 top-0 h-screen w-screen overflow-hidden">
      <div className="relative">
        <Header />
        <HomeCarousel options={OPTIONS} />
        <Footer />
      </div>
      <Toaster />
    </div>
  );
};

export default Home;
