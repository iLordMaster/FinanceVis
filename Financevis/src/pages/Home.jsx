import { useState } from "react";
import Navbar from "../components/Navbar";
import TitleSection from "../components/TitleSection";
import FinancialOverview from "../components/FinancialOverview";
import Footer from "../components/Footer";

function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEntryAdded = () => {
    console.log("Entry added! Triggering refresh...");
    // Increment refresh key to trigger re-fetch in FinancialOverview
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="app">
      <Navbar />
      <TitleSection onEntryAdded={handleEntryAdded} />
      <FinancialOverview refreshTrigger={refreshKey} />
      <Footer />
    </div>
  );
}

export default Home;


