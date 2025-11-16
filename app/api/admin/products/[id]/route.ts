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


export async function GET(request: NextRequest, context: { params: { id: string } }) {
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

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  await dbConnect();
  const { id } = await context.params;

  try {
    const body = await request.json();
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

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Identify images to delete from Cloudinary
    const oldPublicIds = existingProduct.cloudinaryPublicIds || [];
    const publicIdsToDelete = oldPublicIds.filter((publicId: string) => !cloudinaryPublicIds.includes(publicId));

    if (publicIdsToDelete.length > 0) {
      await Promise.all(publicIdsToDelete.map((publicId: string) => cloudinary.uploader.destroy(publicId)));
    }

    // If category changed, regenerate SKU
    let newSku = existingProduct.sku;
    if (existingProduct.category !== category) {
      let prefix = '';
      if (category === 'vinyl-cd') {
        prefix = 'VC';
      } else if (category === 'audio-equipment') {
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
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, { ...body, sku: newSku, cloudinaryPublicIds }, { new: true, runValidators: true });
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

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
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