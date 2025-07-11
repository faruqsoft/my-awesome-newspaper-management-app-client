// client/src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddArticle from "./pages/AddArticle";
import AllArticles from "./pages/AllArticles";
import Subscription from "./pages/Subscription";

import PremiumArticles from "./pages/PremiumArticles";
import MyArticles from "./pages/MyArticles";
import MyProfile from "./pages/MyProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import PrivateRoute from "./routes/PrivateRoute";
import AddPublisher from "./pages/dashboard/AddPublisher";
 import AdminRoute from "./routes/AdminRoute";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-article" element={<PrivateRoute><AddArticle /></PrivateRoute>} />
        <Route path="/all-articles" element={<AllArticles />} />
        <Route path="/subscription" element={<PrivateRoute><Subscription /></PrivateRoute>} />
        
        <Route path="/premium-articles" element={<PrivateRoute><PremiumArticles /></PrivateRoute>} />
        <Route path="/my-articles" element={<PrivateRoute><MyArticles /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/AddPublisher" element={<PrivateRoute><AdminRoute><AddPublisher/></AdminRoute></PrivateRoute>} />
     

        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  );
}

export default App;
