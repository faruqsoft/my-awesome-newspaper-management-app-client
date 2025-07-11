import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const AllArticles = () => {
  const [publisherFilter, setPublisherFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [publishers, setPublishers] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios.get("http://localhost:5000/publishers").then((res) => setPublishers(res.data));
  }, []);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["articles", publisherFilter, tagFilter, searchText],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/articles", {
        params: {
          publisher: publisherFilter,
          tag: tagFilter,
          search: searchText,
        },
      });
      return res.data;
    },
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6">📰 All Articles</h2>

      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <input
          type="text"
          placeholder="Search title..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="input input-bordered"
        />

        <select
          value={publisherFilter}
          onChange={(e) => setPublisherFilter(e.target.value)}
          className="select select-bordered"
        >
          <option value="">All Publishers</option>
          {publishers.map((pub) => (
            <option key={pub._id} value={pub.name}>{pub.name}</option>
          ))}
        </select>

        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="select select-bordered"
        >
          <option value="">All Tags</option>
          {["Politics", "Business", "Technology", "Health", "Sports"].map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="text-center">Loading articles...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => (
            <div
              key={a._id}
              className={`border p-4 rounded shadow-md ${a.isPremium ? "bg-yellow-100" : "bg-white"}`}
            >
              <img src={a.image} alt={a.title} className="w-full h-40 object-cover rounded mb-3" />
              <h3 className="text-lg font-semibold">{a.title}</h3>
              <p className="text-sm text-gray-600">Publisher: {a.publisher}</p>
              <p className="text-sm">{a.description.slice(0, 80)}...</p>
              <div className="mt-2">
                {a.isPremium && !user?.premiumTaken ? (
                  <button className="btn btn-disabled w-full">Premium Only</button>
                ) : (
                  <Link to={`/article/${a._id}`} className="btn btn-primary w-full">
                    Details
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllArticles;