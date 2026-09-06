import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import EducationForm from "@/react-app/pages/EducationForm";
import TradingToolsForm from "@/react-app/pages/TradingToolsForm";
import SignIn from "@/react-app/pages/SignIn";
import SignUp from "@/react-app/pages/SignUp";
import Checkout from "@/react-app/pages/Checkout";
import PaymentSuccess from "@/react-app/pages/PaymentSuccess";
import PaymentFailed from "@/react-app/pages/PaymentFailed";
import PaymentStatus from "@/react-app/pages/PaymentStatus";
import DiscoverPage from "@/react-app/pages/DiscoverPage";
import Contact from "@/react-app/pages/Contact";
import { AuthProvider } from "@/react-app/lib/auth";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/education" element={<EducationForm />} />
          <Route path="/trading-tools" element={<TradingToolsForm />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/checkout/:courseId" element={<Checkout />} />
          <Route path="/payments/success" element={<PaymentSuccess />} />
          <Route path="/payments/failed" element={<PaymentFailed />} />
          <Route path="/payments/status/:merchantOrderId" element={<PaymentStatus />} />
          <Route path="/marketplace" element={<DiscoverPage />} />
          <Route path="/leaderboard" element={<DiscoverPage />} />
          <Route path="/community-feed" element={<DiscoverPage />} />
          <Route path="/buy-sell-crypto" element={<DiscoverPage />} />
          <Route path="/otc-crypto" element={<DiscoverPage />} />
          <Route path="/token-listing" element={<DiscoverPage />} />
          <Route path="/crypto-airdrop" element={<DiscoverPage />} />
          <Route path="/web3-sandbox" element={<DiscoverPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
