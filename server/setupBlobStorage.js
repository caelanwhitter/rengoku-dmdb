require('dotenv').config();
const { BlobServiceClient } = require('@azure/storage-blob');

async function setupBlobContainer() {
    /* Get connection string */
    console.log('Setting up Azure Blob Storage...');
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

    /* Create a container */

    // Create the BlobServiceClient object which will be used to create a container client
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

    // Create a unique name for the container
    const containerName = 'rengokublobs';

    console.log('\nCreating container...');
    console.log('\t', containerName);

    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Create the container
    const createContainerResponse = await containerClient.create();
    console.log("Container was created successfully. requestId: ", createContainerResponse.requestId);

    /* Upload blobs to a container */

    // Create a unique name for the blob
    const blobName = 'rengoku.txt';

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    console.log('\nUploading to Azure storage as blob:\n\t', blobName);

    // Upload data to blob
    const data = 'Hello, World!';
    const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
    console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);

    /* List all blobs */
    console.log("\nListing blobs...");

    // List the blobs in the container
    for await (const blob of containerClient.listBlobsFlat()) {
        console.log('\t', blob.name);
    }

    /* Download blobs */
    // Get blob content from position 0 to the end
    // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
    // In browsers, get downloaded data by accessing downloadBlockBlobResponse.blobBody
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    console.log('\nDownloaded blob content...');
    console.log('\t', await streamToString(downloadBlockBlobResponse.readableStreamBody));

    //deleteContainer();

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

async function deleteContainer() {
    /* Delete a container */
    console.log('\nDeleting container...');

    // Delete container
    const deleteContainerResponse = await containerClient.delete();
    console.log("Container was deleted successfully. requestId: ", deleteContainerResponse.requestId);
}

// Runs setupBlobStorage.js
setupBlobContainer().catch((ex) => console.log(ex.message));