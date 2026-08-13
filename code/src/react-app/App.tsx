import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import EducationForm from "@/react-app/pages/EducationForm";
import TradingToolsForm from "@/react-app/pages/TradingToolsForm";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/education" element={<EducationForm />} />
        <Route path="/trading-tools" element={<TradingToolsForm />} />
      </Routes>
    </Router>
  );
}
