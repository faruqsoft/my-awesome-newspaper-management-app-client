import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const AllPublishers = () => {
  const { data: publishers = [] } = useQuery({
    queryKey: ["publishers"],
    queryFn: async () => (await axios.get("http://localhost:5000/publishers")).data,
  });

  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold text-center mb-6">📰 Our Publishers</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {publishers.map((pub) => (
          <div key={pub._id} className="border rounded-lg p-4 text-center shadow hover:shadow-md hover:scale-105 duration-300">
            <img src={pub.logo} alt={pub.name} className="h-16 w-16 mx-auto mb-2 object-contain" />
            <p className="text-lg font-semibold">{pub.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllPublishers;