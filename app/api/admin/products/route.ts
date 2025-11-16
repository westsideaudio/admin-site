import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});


export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const body = await request.json();
    // Basic validation
    const { name, description, category, price, stock, cloudinaryPublicIds, attributes } = body;
    const errors: string[] = [];

    if (!name) errors.push("name is required");
    if (!description) errors.push("description is required");
    if (!category) errors.push("category is required");
    if (price === undefined) errors.push("price is required");
    if (stock === undefined) errors.push("stock is required");
    if (!cloudinaryPublicIds) errors.push("cloudinaryPublicIds are required");
    if (!attributes) errors.push("attributes are required");

    if (cloudinaryPublicIds && (!Array.isArray(cloudinaryPublicIds) || cloudinaryPublicIds.some(id => typeof id !== 'string'))) {
      errors.push("cloudinaryPublicIds must be an array of strings");
    }
    if (price !== undefined && typeof price !== 'number') {
      errors.push("price must be a number");
    }
    if (stock !== undefined && typeof stock !== 'number') {
      errors.push("stock must be a number");
    }

    if (errors.length > 0) {
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
    }

    let prefix = '';
    if (category === 'vinyl-cd') {
      prefix = 'VC';
    } else if (category === 'audio-equipment') {
      prefix = 'AE';
    } else {
      return NextResponse.json({ message: "Invalid category for SKU generation" }, { status: 400 });
    }

    let sku;
    let counter = 0;
    let isUnique = false;

    while (!isUnique) {
      counter++;
      const paddedCounter = String(counter).padStart(3, '0');
      sku = `${prefix}${paddedCounter}`;
      const existingProduct = await Product.findOne({ sku });
      if (!existingProduct) {
        isUnique = true;
      }
    }

    const newProduct = await Product.create({ ...body, sku, cloudinaryPublicIds });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const products = await Product.find({});
    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}