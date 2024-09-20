import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AddTeacher from "./pages/AddTeacher";
import AddSubject from "./pages/AddSubject";
import AddClass from "./pages/AddClass";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the new component

const App = () => {
  return (
    <Routes>
      {/* Layout for all general routes */}
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-class"
          element={
            <ProtectedRoute>
              <AddClass />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-subject"
          element={
            <ProtectedRoute>
              <AddSubject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-teacher"
          element={
            <ProtectedRoute>
              <AddTeacher />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Routes without layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default App;
