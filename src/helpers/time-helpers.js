export const getLookBackHours = (time) => {
  if (time === "morning") {
    return 14;
  }
  if (time === "evening") {
    return 10;
  }
};
