export const getCurrentDateInfo = () => {
  const now = new Date();

  // Get year in YYYY format
  const year = now.getFullYear();

  // Get day of month with leading zero if needed (DD format)
  const day = String(now.getDate()).padStart(2, "0");

  // Get full month name
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[now.getMonth()];

  return {
    year: year,
    day: day,
    month: month,
  };
};
