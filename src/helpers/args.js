export const handleArgs = () => {
  const args = process.argv.slice(2);
  const argMap = {};
  args.forEach((arg) => {
    if (arg.startsWith("--")) {
      const res = arg.slice(2).replace("=", "^^^^^").split("^^^^^"); // Remove '--' and split by '='
      const [key, value] = res; // Remove '--' and split by '='

      if (false) {
        argMap[key] = `${value}${query}`;
      } else {
        argMap[key] = value;
      }
    }
  });
  return argMap;
};
