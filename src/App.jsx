import {  Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AddTeacher from "./pages/AddTeacher";
import AddSubject from "./pages/AddSubject";
import AddClass from "./pages/AddClass";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Layout from "./components/Layout.jsx";

const App = () => {
  return (
    <Routes>
      {/* Layout for all general routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/add-class" element={<AddClass />} />
        <Route path="/add-subject" element={<AddSubject />} />
        <Route path="/add-teacher" element={<AddTeacher />} />
      </Route>

      {/* Routes without layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default App;
