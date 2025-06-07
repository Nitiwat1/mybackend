const fs = require("fs");
const path = require("path");

const getEngagementData = () => {
  const filePath = path.join(__dirname, "../../data/example_data.json");
  const rawData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(rawData);
};

module.exports = {
  getEngagementData,
};
