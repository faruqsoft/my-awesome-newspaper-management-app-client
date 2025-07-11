import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const ArticleDetails = () => {
  const { id } = useParams();

  // ⬆️ Increase view count on mount
  useEffect(() => {
    axios.patch(`http://localhost:5000/articles/${id}/view`).catch((err) => console.error(err));
  }, [id]);

  // 🔁 Get article data
  const { data: article = {}, isLoading } = useQuery({
    queryKey: ["article", id],
    queryFn: async () => (await axios.get(`http://localhost:5000/articles/${id}`)).data,
  });

  if (isLoading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <img src={article.image} alt={article.title} className="w-full h-64 object-cover rounded" />
      <h2 className="text-3xl font-bold mt-6">{article.title}</h2>
      <p className="text-gray-500 mb-1">Publisher: {article.publisher}</p>
      <p className="text-gray-600 text-sm mb-3">Views: {article.views}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {article.tags?.map((tag, idx) => (
          <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
            #{tag}
          </span>
        ))}
      </div>
      <p className="text-lg leading-relaxed">{article.description}</p>
    </div>
  );
};

export default ArticleDetails;