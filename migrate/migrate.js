const cloudinary = require('cloudinary').v2;

const { BlobServiceClient } = require('@azure/storage-blob');

const { DefaultAzureCredential } = require('@azure/identity');

const axios = require('axios');
 
// 1. Configure Cloudinary

cloudinary.config({ 

  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 

  api_key: process.env.CLOUDINARY_API_KEY, 

  api_secret: process.env.CLOUDINARY_API_SECRET      

});
 
// 2. Configure Azure (data3262)

const blobServiceClient = new BlobServiceClient(

  "https://data3262.blob.core.windows.net", 

  new DefaultAzureCredential()

);
 
async function startMigration() {

  const containerClient = blobServiceClient.getContainerClient("hr-portal");
 
  // 3. Fetch list of resources from Cloudinary

  const { resources } = await cloudinary.api.resources({ resource_type: 'image', max_results: 500 });
 
  for (const asset of resources) {

    console.log(`Migrating: ${asset.public_id}...`);
 
    // 4. Stream directly from Cloudinary URL to Azure

    const response = await axios({ method: 'get', url: asset.secure_url, responseType: 'stream' });

    const blockBlobClient = containerClient.getBlockBlobClient(`${asset.public_id}.${asset.format}`);
 
    await blockBlobClient.uploadStream(response.data);

    // 5. Update MongoDB/DocumentDB (Reference logic)

    const newAzureUrl = blockBlobClient.url;

    // await db.collection('employees').updateOne({ photoUrl: asset.secure_url }, { $set: { photoUrl: newAzureUrl } });

  }

  console.log("Migration Complete!");

}
 
startMigration().catch(console.error);
 