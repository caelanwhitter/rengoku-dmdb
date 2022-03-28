/**
 * setupBlobStorage.js is a file that is run one time 
 * to set up the Azure Blob Storage and will be kept running by Microsoft.
 * In case the blob storage gets deleted, we can create a new one by running this file.
 * @author Daniel Lam
 */
require("dotenv").config();
const { BlobServiceClient } = require("@azure/storage-blob");

/**
 * setupBlobContainer() is a method that creates the `rengokublobs` Azure Storage container 
 * to store all the blobs needed for the website
 */
async function setupBlobContainer() {
  /* Get connection string */
  console.log("Setting up Azure Blob Storage...");
  const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

  /* Create a container */

  // Create the BlobServiceClient object which will be used to create a container client
  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

  // Create a unique name for the container
  const containerName = "rengokublobs";

  console.log("\nCreating container...");
  console.log("\t", containerName);

  // Get a reference to a container
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Create the container
  const createContainerResponse = await containerClient.create();
  console.log("Container was created successfully. requestId: ", createContainerResponse.requestId);

  /* Download blobs */
  // Get blob content from position 0 to the end
  // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
  // In browsers, get downloaded data by accessing downloadBlockBlobResponse.blobBody
  const downloadBlockBlobResponse = await blockBlobClient.download(0);
  console.log("\nDownloaded blob content...");
  console.log("\t", await streamToString(downloadBlockBlobResponse.readableStreamBody));

  console.log("Done!");
}

// A helper function used to read a Node.js readable stream into a string
async function streamToString(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data.toString());
    });
    readableStream.on("end", () => {
      resolve(chunks.join(""));
    });
    readableStream.on("error", reject);
  });
}

// Runs setupBlobStorage.js
setupBlobContainer().catch((ex) => console.log(ex.message));