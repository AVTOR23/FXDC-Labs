import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import EducationForm from "@/react-app/pages/EducationForm";
import TradingToolsForm from "@/react-app/pages/TradingToolsForm";
import SignIn from "@/react-app/pages/SignIn";
import SignUp from "@/react-app/pages/SignUp";
import { AuthProvider } from "@/react-app/lib/auth";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/education" element={<EducationForm />} />
          <Route path="/trading-tools" element={<TradingToolsForm />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
