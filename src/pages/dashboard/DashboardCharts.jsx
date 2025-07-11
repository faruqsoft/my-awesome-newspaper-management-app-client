import { Chart } from "react-google-charts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const DashboardCharts = () => {
  const { data = {} } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () =>
      (await axios.get("http://localhost:5000/dashboard/stats")).data,
  });

  const pieData = [
    ["Type", "Count"],
    ["Users", data.totalUsers || 0],
    ["Premium Users", data.premiumUsers || 0],
    ["Pending Articles", data.pendingArticles || 0],
    ["Articles", data.totalArticles || 0],
  ];

  const barData = [
    ["Day", "Visits"],
    ["Mon", 300],
    ["Tue", 450],
    ["Wed", 200],
    ["Thu", 350],
    ["Fri", 400],
  ];

  const areaData = [
    ["Month", "Articles"],
    ["Jan", 30],
    ["Feb", 20],
    ["Mar", 40],
    ["Apr", 35],
    ["May", 50],
  ];

  return (
    <div className="space-y-10">
      <Chart chartType="PieChart" data={pieData} width="100%" height="300px" />
      <Chart chartType="BarChart" data={barData} width="100%" height="300px" />
      <Chart chartType="AreaChart" data={areaData} width="100%" height="300px" />
    </div>
  );
};

export default DashboardCharts;
