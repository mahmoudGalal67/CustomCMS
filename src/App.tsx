import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./app/admin/layout.jsx";
import HomeEditor from "./app/admin/pages/HomeEditor.jsx";
import Settings from "./app/admin/pages/Settings.js";
import Home from "./app/site/Home.js";
import Login from "./app/site/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.js";
import StaticPages from './app/admin/pages/StaticPages.js';
import AddNewPage from './app/admin/pages/AddNewPage.js';

export default function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home editable={false} />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="home" />} />
          <Route path="home" element={<HomeEditor />} />
          <Route path="StaticPages/:id" element={<StaticPages />} />
          <Route path="AddStaticPage" element={<AddNewPage />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
