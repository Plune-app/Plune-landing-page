import React from 'react';
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';
import Plune1 from "../assets/plune-1.png";
import Plune2 from "../assets/plune-2.png";
import Plune3 from "../assets/plune-3.png";
import Plune4 from "../assets/plune-4.png";
import Plune5 from "../assets/plune-5.png";
import Plune6 from "../assets/plune-6.png";
import PluneVideo from "../assets/plune-show-video.mp4"
import Autoplay from "embla-carousel-autoplay"

const carouselImages: { title: string, image: string }[] = [
  {
    image: Plune1,
    title: "Manage flow diagrams"
  },
  {
    image: Plune3,
    title: "Create no-code forms"
  },
  {
    image: Plune2,
    title: "Choose theme u prefer"
  },
  {
    image: Plune4,
    title: "Detailed field properties"
  },
  {
    image: Plune5,
    title: "Manage organizations"
  },
  {
    image: Plune6,
    title: "Set colaborators roles"
  },
];
interface FeatureCardProps {
  title: string;
  img: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, img }) => {
  return (
    <div className="group w-full">
      <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 text-center">
        {title}
      </h4>
      <div className="bg-white/10 dark:bg-zinc-800/30 backdrop-blur-md rounded-2xl border border-white/20 dark:border-zinc-700/50 overflow-hidden hover:bg-white/20 dark:hover:bg-zinc-800/50 transition-all duration-300 hover:scale-105">
        <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-zinc-200/30 to-zinc-300/30 dark:from-zinc-800/30 dark:to-zinc-700/30">
          <div
            className={`w-full h-full object-contain bg-gradient-to-br rounded-xl flex items-center justify-center  mx-auto group-hover:scale-105 transition-transform duration-300`}
          >
            <img src={img} alt={title} />
          </div>

        </div>
      </div>
    </div>
  );
};

export const Demo: React.FC = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
          See Plune.app
          <span className="block bg-gradient-to-r from-zinc-600 to-zinc-800 dark:from-zinc-400 dark:to-zinc-600 bg-clip-text text-transparent">
            In Action
          </span>
        </h2>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
          Explore the powerful features and intuitive interface of our workflow management platform
        </p>
      </div>

      {/* Video Demo Section */}
      <div className="mb-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 text-center">
            Product Demo Video
          </h3>
          <div className="relative group bg-white/10 dark:bg-zinc-800/30 backdrop-blur-md rounded-2xl border border-white/20 dark:border-zinc-700/50 overflow-hidden hover:bg-white/20 dark:hover:bg-zinc-800/50 transition-all duration-300">
            <div className=" flex items-center justify-center bg-gradient-to-br from-zinc-200/30 to-zinc-300/30 dark:from-zinc-800/30 dark:to-zinc-700/30">
              <div className="text-center">
                <div className="w-full bg-gradient-to-br from-zinc-500/20 to-zinc-600/20 rounded-full flex items-center justify-center  mx-auto">
                <video autoPlay muted controls className='h-full w-full'>
                  <source src={PluneVideo} type='video/mp4'/>
                </video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >

      {/* Screenshots Grid */}
      <Carousel
        plugins={[plugin.current]}
        className="w-full "
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {carouselImages.map((img, idx) => (
            <CarouselItem key={idx}>
              <FeatureCard img={img.image} title={img.title} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};
