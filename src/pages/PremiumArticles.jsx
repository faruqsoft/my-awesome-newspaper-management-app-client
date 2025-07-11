import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Link } from "react-router-dom";

const PremiumArticles = () => {
  const { user } = useContext(AuthContext);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["premium-articles"],
    queryFn: async () => (await axios.get("http://localhost:5000/articles/premium")).data,
  });

  if (isLoading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Premium Articles ✨</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div key={article._id} className="border rounded shadow p-4">
            <img src={article.image} alt={article.title} className="w-full h-40 object-cover rounded mb-3" />
            <h3 className="text-lg font-bold mb-2">{article.title}</h3>
            <p className="text-sm text-gray-600 mb-1">Publisher: {article.publisher}</p>
            <p className="line-clamp-3 text-sm mb-2">{article.description}</p>
            <Link
              to={`/article/${article._id}`}
              className="text-blue-500 underline text-sm mt-2 inline-block"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PremiumArticles;
