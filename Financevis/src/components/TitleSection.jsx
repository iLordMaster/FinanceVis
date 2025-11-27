import { useState } from "react";
import "./TitleSection.css";
import AddIncomeModal from "./AddIncomeModal";

function TitleSection({ onEntryAdded }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="title-section">
      <h1>Take Control of Your <br /> Financial Future</h1>
      <p>
        Visualize your income streams, track your earnings, and make informed
        decisions with FinanceVis, your personal finance companion designed for
        clarity and confidence.
      </p>
      <button className="add-income-btn" onClick={() => setIsModalOpen(true)}>
        Add income Entry
      </button>
      <AddIncomeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={onEntryAdded}
      />
    </section>
  );
}

export default TitleSection;
