import { useState, useEffect } from "react";
import { UserApi } from "../../api/userApi";
import { useAccount } from "../../context/AccountContext";
import {
  FaHome,
  FaUser,
  FaCar,
  FaShoppingCart,
  FaUtensils,
  FaFilm,
  FaHeartbeat,
  FaGraduationCap,
  FaPlane,
  FaWallet,
  FaQuestion,
} from "react-icons/fa";

// Map category names to icons
const categoryIcons = {
  Housing: FaHome,
  Personal: FaUser,
  Transportation: FaCar,
  Shopping: FaShoppingCart,
  Food: FaUtensils,
  Entertainment: FaFilm,
  Healthcare: FaHeartbeat,
  Education: FaGraduationCap,
  Travel: FaPlane,
  Other: FaWallet,
  Others: FaWallet,
};

export default function SpendingList({ selectedMonth }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedAccount } = useAccount();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        // Determine the target month index
        const selectedMonthIndex = selectedMonth
          ? monthNames.indexOf(selectedMonth)
          : currentDate.getMonth();

        if (selectedMonthIndex === -1) {
          console.error("Invalid month name:", selectedMonth);
          setCategories([]);
          setLoading(false);
          return;
        }

        // Handle year transition
        if (selectedMonthIndex > currentDate.getMonth()) {
          currentYear -= 1;
        }

        // Calculate startDate and endDate
        const startDate = new Date(currentYear, selectedMonthIndex, 1);
        const endDate = new Date(
          currentYear,
          selectedMonthIndex + 1,
          0,
          23,
          59,
          59,
          999
        );

        // Format dates as ISO strings for the API
        const startDateStr = startDate.toISOString();
        const endDateStr = endDate.toISOString();

        // Build query with account filter if selected
        const accountParam = selectedAccount?.id
          ? `&accountId=${selectedAccount.id}`
          : "";
        const response = await UserApi.request(
          `/api/dashboard/top-categories?startDate=${startDateStr}&endDate=${endDateStr}${accountParam}`
        );

        console.log("Expense categories API response:", response);

        if (Array.isArray(response)) {
          setCategories(response);
        } else {
          console.error(
            "Expected array from top-categories but got:",
            response
          );
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching expense categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, selectedAccount]); // Added selectedAccount dependency

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#9ca3af" }}>
        Loading...
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#9ca3af" }}>
        No spending data available
      </div>
    );
  }

  return (
    <div className="category-list">
      {categories.map((category, index) => {
        // Get the icon component for this category, default to FaQuestion
        const IconComponent =
          categoryIcons[category.categoryName] || FaQuestion;

        return (
          <div key={index} className="category-item">
            <div
              className="cat-icon"
              style={{ backgroundColor: category.color || "#4f46e5" }}
            >
              <IconComponent />
            </div>
            <div className="cat-details">
              <span className="cat-name">{category.categoryName}</span>
              <span className="cat-amount">
                ${category.total.toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
