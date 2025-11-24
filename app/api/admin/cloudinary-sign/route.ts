import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { paramsToSign } = body;

        const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET as string);

        return NextResponse.json({ signature, apiKey: process.env.CLOUDINARY_API_KEY });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}
