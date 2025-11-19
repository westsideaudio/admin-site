import mongoose, { Document, Schema } from "mongoose";

export interface Product extends Document {
  _id: string;
  name: string;
  description: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  cloudinaryPublicIds: string[]; // Store Cloudinary public IDs
  attributes: Object; // This will store Artist, Genre, Condition, etc.
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    cloudinaryPublicIds: { type: [String], required: true }, // Store Cloudinary public IDs
    attributes: { type: Object, required: true }, // Store attributes as a generic object
    featured: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    collection: 'products' // Explicitly set the collection name
  }
);

const Product = mongoose.models.Product || mongoose.model<Product>("Product", ProductSchema);

export default Product;