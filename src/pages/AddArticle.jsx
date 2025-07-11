import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Select from "react-select";

const tagsOptions = [
  { value: "Politics", label: "Politics" },
  { value: "Business", label: "Business" },
  { value: "Technology", label: "Technology" },
  { value: "Health", label: "Health" },
  { value: "Sports", label: "Sports" },
];

const AddArticle = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [publisher, setPublisher] = useState("");
  const [tags, setTags] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const imgbbKey = import.meta.env.VITE_IMGBB_KEY;

  useEffect(() => {
    axios.get("http://localhost:5000/publishers").then((res) => setPublishers(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !title || !description || !publisher || tags.length === 0) {
      return toast.error("All fields are required");
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const upload = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
        formData
      );

      const imageUrl = upload.data.data.url;
      const token = localStorage.getItem("token");
      const articleData = {
        title,
        image: imageUrl,
        description,
        publisher,
        tags: tags.map((t) => t.value),
      };

      await axios.post("http://localhost:5000/articles", articleData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Article submitted (Pending approval)");
      setTitle("");
      setDescription("");
      setImage(null);
      setPublisher("");
      setTags([]);
    } catch (err) {
      toast.error("Failed to post article");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">📝 Add New Article</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered w-full"
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="file-input file-input-bordered w-full"
        />

        <select
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
          className="select select-bordered w-full"
        >
          <option value="">Select Publisher</option>
          {publishers.map((pub) => (
            <option key={pub._id} value={pub.name}>{pub.name}</option>
          ))}
        </select>

        <Select
          options={tagsOptions}
          isMulti
          value={tags}
          onChange={setTags}
          className="z-10"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered w-full"
        />

        <button className="btn btn-primary w-full">Submit Article</button>
      </form>
    </div>
  );
};

export default AddArticle;