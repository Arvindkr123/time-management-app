import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import AddTeacher from "./pages/AddTeacher";
import AddSubject from "./pages/AddSubject";
import AddClass from "./pages/AddClass";

const App = () => {
  return (
    <Router>
      <Header />
      <main className="">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-class" element={<AddClass />} />
          <Route path="/add-subject" element={<AddSubject />} />
          <Route path="/add-teacher" element={<AddTeacher />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
