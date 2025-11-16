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


export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await context.params;

  try {
    console.log('Backend: Received product ID for GET:', id);
    const product = await Product.findById(id);
    console.log('Backend: Product found by ID:', product);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error: any) {
    if (error.name === 'CastError') {
      return NextResponse.json({ message: "Invalid product ID format" }, { status: 400 });
    }
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await context.params;

  try {
    const body = await request.json();
    const { name, description, category, price, stock, cloudinaryPublicIds, attributes, featured } = body;
    const errors: string[] = [];
    const updateFields: Record<string, any> = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') errors.push("name must be a non-empty string");
      updateFields.name = name;
    }
    if (description !== undefined) {
      if (typeof description !== 'string' || description.trim() === '') errors.push("description must be a non-empty string");
      updateFields.description = description;
    }
    if (category !== undefined) {
      if (typeof category !== 'string' || category.trim() === '') errors.push("category must be a non-empty string");
      updateFields.category = category;
    }
    if (price !== undefined) {
      if (typeof price !== 'number' || isNaN(price)) errors.push("price must be a number");
      updateFields.price = price;
    }
    if (stock !== undefined) {
      if (typeof stock !== 'number' || isNaN(stock)) errors.push("stock must be a number");
      updateFields.stock = stock;
    }
    if (cloudinaryPublicIds !== undefined) {
      if (!Array.isArray(cloudinaryPublicIds) || cloudinaryPublicIds.some(id => typeof id !== 'string')) {
        errors.push("cloudinaryPublicIds must be an array of strings");
      }
      updateFields.cloudinaryPublicIds = cloudinaryPublicIds;
    }
    if (attributes !== undefined) {
      if (typeof attributes !== 'object' || attributes === null) errors.push("attributes must be an object");
      updateFields.attributes = attributes;
    }
    if (featured !== undefined) {
      if (typeof featured !== 'boolean') errors.push("featured must be a boolean");
      updateFields.featured = featured;
    }

    if (errors.length > 0) {
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Handle Cloudinary image deletion if cloudinaryPublicIds are provided in the update
    if (updateFields.cloudinaryPublicIds) {
      const oldPublicIds = existingProduct.cloudinaryPublicIds || [];
      const publicIdsToDelete = oldPublicIds.filter((publicId: string) => !updateFields.cloudinaryPublicIds.includes(publicId));

      if (publicIdsToDelete.length > 0) {
        await Promise.all(publicIdsToDelete.map((publicId: string) => cloudinary.uploader.destroy(publicId)));
      }
    }

    // If category changed, regenerate SKU
    let newSku = existingProduct.sku;
    if (updateFields.category && existingProduct.category !== updateFields.category) {
      let prefix = '';
      if (updateFields.category === 'vinyl-cd') {
        prefix = 'VC';
      } else if (updateFields.category === 'audio-equipment') {
        prefix = 'AE';
      } else {
        return NextResponse.json({ message: "Invalid category for SKU generation" }, { status: 400 });
      }

      let counter = 0;
      let isUnique = false;
      while (!isUnique) {
        counter++;
        const paddedCounter = String(counter).padStart(3, '0');
        const potentialSku = `${prefix}${paddedCounter}`;
        const existingSkuProduct = await Product.findOne({ sku: potentialSku });
        if (!existingSkuProduct || existingSkuProduct._id.toString() === id) { // Ensure uniqueness or if it's the same product
          newSku = potentialSku;
          isUnique = true;
        }
      }
      updateFields.sku = newSku;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, { ...updateFields }, { new: true, runValidators: true });
    return NextResponse.json(updatedProduct, { status: 200 });

  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ message: "SKU must be unique." }, { status: 409 });
    }
    if (error.name === 'CastError') {
      return NextResponse.json({ message: "Invalid product ID format" }, { status: 400 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await context.params;

  try {
    const productToDelete = await Product.findById(id);
    if (!productToDelete) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const publicIds = productToDelete.cloudinaryPublicIds;

    if (publicIds && publicIds.length > 0) {
      await Promise.all(publicIds.map((publicId: string) => cloudinary.uploader.destroy(publicId)));
    }

    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });

  } catch (error: any) {
    if (error.name === 'CastError') {
      return NextResponse.json({ message: "Invalid product ID format" }, { status: 400 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}