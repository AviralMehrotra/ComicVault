/**
 * Utility function to get status color styling
 * @param {string} status - The status (reading, completed, planned, dropped)
 * @returns {object} Object with backgroundColor and color properties
 */
export const getStatusColor = (status) => {
  switch (status) {
    case "reading":
      return { backgroundColor: "var(--status-reading)", color: "white" };
    case "completed":
      return { backgroundColor: "var(--status-completed)", color: "white" };
    case "planned":
      return { backgroundColor: "var(--status-planned)", color: "white" };
    case "dropped":
      return { backgroundColor: "var(--status-dropped)", color: "white" };
    default:
      return {
        backgroundColor: "var(--muted)",
        color: "var(--muted-foreground)",
      };
  }
};

/**
 * Format status text for display
 * @param {string} status - The status
 * @returns {string} Formatted status text
 */
export const formatStatus = (status) => {
  switch (status) {
    case "completed":
      return "Completed";
    case "reading":
      return "Currently Reading";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

