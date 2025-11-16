'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUpload: (publicIds: string[]) => void;
  initialCloudinaryPublicIds?: string[];
}

const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your_cloud_name'}/image/upload/`;

export default function ImageUpload({ onImageUpload, initialCloudinaryPublicIds = [] }: ImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedPublicIds, setUploadedPublicIds] = useState<string[]>(initialCloudinaryPublicIds);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUploadedPublicIds(initialCloudinaryPublicIds);
  }, [initialCloudinaryPublicIds]);

  useEffect(() => {
    onImageUpload(uploadedPublicIds);
  }, [uploadedPublicIds, onImageUpload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select files to upload.');
      return;
    }

    setUploading(true);
    setError(null);
    const newPublicIds: string[] = [];

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'your_unsigned_upload_preset');
      formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your_cloud_name');

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your_cloud_name'}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          newPublicIds.push(data.public_id);
        } else {
          const errorData = await res.json();
          setError(`Failed to upload ${file.name}: ${errorData.error.message}`);
          break;
        }
      } catch (err: any) {
        setError(`Network error uploading ${file.name}: ${err.message}`);
        break;
      }
    }

    setUploadedPublicIds((prev) => [...prev, ...newPublicIds]);
    setSelectedFiles([]);
    setUploading(false);
  };

  const handleRemoveImage = (publicIdToRemove: string) => {
    setUploadedPublicIds((prev) => prev.filter((publicId) => publicId !== publicIdToRemove));
    // TODO: Optionally call Cloudinary API to delete the image from storage
  };

  return (
    <div className="border p-4 rounded-md">
      <input type="file" multiple onChange={handleFileChange} accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      <button type="button" onClick={handleUpload} disabled={uploading || selectedFiles.length === 0} className="mt-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50">
        {uploading ? 'Uploading...' : 'Upload Selected Images'}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}

      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Files to upload:</h3>
          <ul className="list-disc list-inside">
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

      {uploadedPublicIds.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Current Images:</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {uploadedPublicIds.map((publicId, index) => (
              <div key={index} className="relative w-24 h-24 border rounded overflow-hidden">
                <Image src={`${CLOUDINARY_BASE_URL}${publicId}`} alt={`Product Image ${index + 1}`} fill style={{ objectFit: "cover" }} />
                <button type="button" onClick={() => handleRemoveImage(publicId)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}