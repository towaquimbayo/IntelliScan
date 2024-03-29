// Constants.js
const production = {
  url: "https://intelliscanserver.noufilsaqib.com",
};
const development = {
  url: "http://localhost:3000",
};
export const config =
  process.env.NODE_ENV === "development" ? development : production;
