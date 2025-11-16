require('dotenv').config({ path: './.env.local' });
import mongoose from 'mongoose';
import Product from '../models/product'; // ES module import

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

const extractPublicId = (imageUrl: string): string | null => {
  const parts = imageUrl.split('/');
  const uploadIndex = parts.indexOf('upload');
  if (uploadIndex > -1) {
    const relevantParts = parts.slice(uploadIndex + 1);
    // Check if the first part after 'upload' is a version string (e.g., 'v1234567890')
    if (relevantParts.length > 0 && relevantParts[0].startsWith('v') && /^\d+$/.test(relevantParts[0].substring(1))) {
      // If it's a version, skip it and take the rest as publicId
      return relevantParts.slice(1).join('/').split('.')[0];
    } else {
      // Otherwise, take all relevant parts as publicId
      return relevantParts.join('/').split('.')[0];
    }
  }
  return null;
};

async function migrateImages() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined.');
    }
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for image migration.');

    // Find products that have imageUrls but cloudinaryPublicIds is empty or missing
    const productsToMigrate = await Product.find({
      imageUrls: { $exists: true, $not: { $size: 0 } },
      $or: [
        { cloudinaryPublicIds: { $exists: false } },
        { cloudinaryPublicIds: { $size: 0 } }
      ]
    });

    if (productsToMigrate.length === 0) {
      console.log('No products found with imageUrls to migrate.');
      await mongoose.disconnect();
      return;
    }

    console.log(`Found ${productsToMigrate.length} products to migrate.`);

    for (const product of productsToMigrate) {
      const newPublicIds = [];
      for (const url of product.imageUrls) {
        const publicId = extractPublicId(url);
        if (publicId) {
          newPublicIds.push(publicId);
        } else {
          console.warn(`Could not extract public ID from URL: ${url} for product ${product._id}`);
        }
      }

      if (newPublicIds.length > 0) {
        await Product.updateOne(
          { _id: product._id },
          {
            $set: { cloudinaryPublicIds: newPublicIds },
            $unset: { imageUrls: 1 } // Remove the old imageUrls field
          }
        );
        console.log(`Migrated product ${product._id}: ${product.name}. Added ${newPublicIds.length} public IDs.`);
      } else {
        console.warn(`No public IDs extracted for product ${product._id}: ${product.name}. Skipping update.`);
      }
    }

    console.log('Image migration complete.');
  } catch (error) {
    console.error('Error during image migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

migrateImages();