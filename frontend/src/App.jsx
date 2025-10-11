
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

import Navbar from "./components/Navbar";
import Home from './page/Home';
import Register from "./page/Register";
import Login from "./page/Login";
import Inform from "./page/Inform";
import Therapy from "./page/Therapy";
import PSQI from "./page/PSQI";
import SleepDiary from "./page/SleepDiary";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-sky-100">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inform" element={<Inform />} />
          <Route path="/therapy" element={<Therapy />} />
          <Route path="/psqi" element={<PSQI />} />
          <Route path="/sleepdiary" element={<SleepDiary />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
