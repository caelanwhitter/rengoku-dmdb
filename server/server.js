/**
 * Start server and listen on port 3001 or PORT environment variable
 * @author Danilo Zhu 1943382
 */

const app = require("./app");
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});