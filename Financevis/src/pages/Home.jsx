import Navbar from "../components/Navbar";
import TitleSection from "../components/TitleSection";
import FinancialOverview from "../components/FinancialOverview";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="app">
      <Navbar />
      <TitleSection />
      <FinancialOverview />
      <Footer />
    </div>
  );
}

export default Home;

