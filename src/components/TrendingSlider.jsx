import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const TrendingSlider = () => {
  const { data: trending = [] } = useQuery({
    queryKey: ["trending"],
    queryFn: async () => (await axios.get("http://localhost:5000/articles/trending")).data,
  });

  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold text-center mb-4">🔥 Trending Articles</h2>
      <Carousel autoPlay infiniteLoop showThumbs={false}>
        {trending.map((item) => (
          <div key={item._id} className="h-[300px] overflow-hidden">
            <img src={item.image} alt={item.title} className="object-cover h-[300px] w-full" />
            <p className="legend text-lg font-semibold">{item.title}</p>
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default TrendingSlider;