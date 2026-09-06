import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@/lib/auth";
import Login from "@/pages/Login";
import Layout from "@/pages/Layout";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import Education from "@/pages/Education";
import TradingTools from "@/pages/TradingTools";
import Media from "@/pages/Media";
import Payments from "@/pages/Payments";
import Contact from "@/pages/Contact";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="education" element={<Education />} />
            <Route path="trading-tools" element={<TradingTools />} />
            <Route path="media" element={<Media />} />
            <Route path="payments" element={<Payments />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}
