import React from 'react';
import { Chart } from 'react-google-charts';
import { Link } from 'react-router-dom';

const publishers = [
  { name: 'Publication A', articles: 2 },
  { name: 'Publication B', articles: 3 },
  { name: 'Publication C', articles: 5 },
];

const totalArticles = publishers.reduce((sum, pub) => sum + pub.articles, 0);
const pieData = [
  ['Publisher', 'Articles'],
  ...publishers.map(pub => [pub.name, pub.articles]),
];

const barData = [
  ['Month', 'New Users', 'New Articles'],
  ['Jan', 30, 40],
  ['Feb', 20, 35],
  ['Mar', 27, 50],
  ['Apr', 40, 60],
];

const lineData = [
  ['Day', 'Subscriptions'],
  ['Mon', 10],
  ['Tue', 14],
  ['Wed', 16],
  ['Thu', 20],
  ['Fri', 18],
  ['Sat', 22],
  ['Sun', 25],
];

const Dashboard = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-tr from-gray-100 to-blue-50">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 xl:w-80 bg-white shadow-xl p-4 sm:p-6 lg:rounded-r-3xl lg:min-h-screen sticky top-0 z-30">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-6 sm:mb-8 text-center lg:text-left">Admin Panel</h2>
        <nav className="flex flex-col space-y-3 sm:space-y-4 text-center lg:text-left">
          <Link to="/dashboard/all-users" className="text-base sm:text-lg font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:bg-blue-50 p-2 rounded-lg">All Users</Link>
          <Link to="/dashboard/all-articles" className="text-base sm:text-lg font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:bg-blue-50 p-2 rounded-lg">All Articles</Link>
          <Link to="/dashboard/add-publisher" className="text-base sm:text-lg font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:bg-blue-50 p-2 rounded-lg">Add Publisher</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 sm:mb-10 text-center lg:text-left">
          Admin Dashboard Overview
        </h1>

        <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {/* Pie Chart */}
          <div className="bg-white rounded-3xl shadow-md p-4 sm:p-6 flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-blue-700">Articles by Publisher</h3>
            <Chart
              chartType="PieChart"
              width="100%"
              height="250px"
              data={pieData}
              options={{
                pieHole: 0.4,
                is3D: false,
                legend: { position: 'bottom' },
                chartArea: { width: '90%', height: '80%' },
                backgroundColor: 'transparent',
              }}
            />
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-3xl shadow-md p-4 sm:p-6 flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-green-600">Monthly Growth</h3>
            <Chart
              chartType="Bar"
              width="100%"
              height="250px"
              data={barData}
              options={{
                legend: { position: 'bottom' },
                chartArea: { width: '80%', height: '70%' },
                colors: ['#60a5fa', '#34d399'],
                backgroundColor: 'transparent',
              }}
            />
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-3xl shadow-md p-4 sm:p-6 flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-purple-700">Weekly Subscriptions</h3>
            <Chart
              chartType="LineChart"
              width="100%"
              height="250px"
              data={lineData}
              options={{
                legend: { position: 'none' },
                chartArea: { width: '80%', height: '70%' },
                colors: ['#a78bfa'],
                pointSize: 6,
                backgroundColor: 'transparent',
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
