/**
 * Start server and listen on port 3001 or PORT environment variable
 * @author Danilo Zhu 1943382
 */

const app = require("./app");
const PORT = process.env.PORT || 3001;
const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();
const CONTAINER_NAME = "rengokublobs";
let containerClient;

app.listen(PORT, () => {
  connectToBlobStorageContainer();
  console.log(`Server listening on port ${PORT}...`);
});

async function connectToBlobStorageContainer() {
  console.log("Connecting to Azure Blob Storage...");
  const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  console.log("Connected to container " + CONTAINER_NAME + "!\n");
}

module.exports = containerClient;



