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
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  useEffect(() => {
    setUploadedPublicIds(initialCloudinaryPublicIds);
  }, [initialCloudinaryPublicIds]);

  useEffect(() => {
    onImageUpload(uploadedPublicIds);
  }, [uploadedPublicIds, onImageUpload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select files to upload.');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);
    const newPublicIds: string[] = [];
    const totalFiles = selectedFiles.length;
    let completedFiles = 0;

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
          completedFiles++;
          setUploadProgress(Math.round((completedFiles / totalFiles) * 100));
        } else {
          const errorData = await res.json();
          setError(`Failed to upload ${file.name}: ${errorData.error.message}`);
          // Don't break, try to upload other files
        }
      } catch (err: any) {
        setError(`Network error uploading ${file.name}: ${err.message}`);
        // Don't break, try to upload other files
      }
    }

    if (newPublicIds.length > 0) {
      setUploadedPublicIds((prev) => [...prev, ...newPublicIds]);
      setSelectedFiles([]); // Clear selection only if some uploads succeeded
    }

    setUploading(false);
    setUploadProgress(0);
  };

  const handleRemoveImage = (publicIdToRemove: string) => {
    if (confirm('Remove this image?')) {
      setUploadedPublicIds((prev) => prev.filter((publicId) => publicId !== publicIdToRemove));
    }
  };

  return (
    <div className="border border-input rounded-md p-4 bg-card">
      <div className="mb-4">
        <label className="block w-full cursor-pointer">
          <span className="sr-only">Choose files</span>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept="image/*"
            className="block w-full text-sm text-muted-foreground
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-primary-foreground
              hover:file:bg-primary/90
              cursor-pointer"
          />
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mb-4 p-3 bg-muted/50 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-foreground">Selected for upload ({selectedFiles.length}):</h3>
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="bg-accent text-white px-4 py-1.5 rounded-md hover:bg-accent/90 disabled:opacity-50 text-sm font-medium transition-colors"
            >
              {uploading ? `Uploading... ${uploadProgress}%` : 'Start Upload'}
            </button>
          </div>
          <ul className="text-xs text-muted-foreground list-disc list-inside max-h-32 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <li key={index} className="truncate">{file.name}</li>
            ))}
          </ul>
          {uploading && (
            <div className="w-full bg-muted mt-2 rounded-full h-2">
              <div
                className="bg-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}

      {uploadedPublicIds.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {uploadedPublicIds.map((publicId, index) => (
            <div key={index} className="group relative aspect-square border border-border rounded-md overflow-hidden bg-muted">
              <Image
                src={`${CLOUDINARY_BASE_URL}${publicId}`}
                alt={`Product Image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleRemoveImage(publicId)}
                  className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors transform hover:scale-110"
                  title="Remove Image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" /><path d="m6 6 18 18" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed border-border rounded-md">
          No images uploaded yet.
        </div>
      )}
    </div>
  );
}