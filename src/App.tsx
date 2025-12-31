import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./app/admin/layout.jsx";
import HomeEditor from "./app/admin/pages/HomeEditor.jsx";
import BrandSettings from "./app/admin/pages/BrandSettings.jsx";
import SocialSettings from "./app/admin/pages/SocialSettings.jsx";
import Home from "./app/site/Home.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home editable={false} />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="home" />} />
        <Route path="home" element={<HomeEditor />} />
        <Route path="brand" element={<BrandSettings />} />
        <Route path="socials" element={<SocialSettings />} />
      </Route>
    </Routes>
  );
}
