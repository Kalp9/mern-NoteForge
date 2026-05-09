import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import CreatePage from "../pages/CreatePage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import NoteDetail from "../pages/NoteDetail";
import SignupPage from "../pages/SignupPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/notes/:id" element={<NoteDetail />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
