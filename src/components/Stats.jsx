import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CountUp from "react-countup";

const Stats = () => {
  const { data: stats = {} } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => (await axios.get("http://localhost:5000/users/stats")).data,
  });

  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold text-center mb-6">📊 Platform Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-white shadow-md p-6 rounded-lg">
          <p className="text-xl font-semibold">Total Users</p>
          <CountUp end={stats.total} duration={2} className="text-3xl font-bold text-blue-600" />
        </div>
        <div className="bg-white shadow-md p-6 rounded-lg">
          <p className="text-xl font-semibold">Premium Users</p>
          <CountUp end={stats.premium} duration={2} className="text-3xl font-bold text-green-600" />
        </div>
        <div className="bg-white shadow-md p-6 rounded-lg">
          <p className="text-xl font-semibold">Admins</p>
          <CountUp end={stats.admin} duration={2} className="text-3xl font-bold text-red-600" />
        </div>
      </div>
    </section>
  );
};

export default Stats;