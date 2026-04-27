import React, { useState } from 'react';
import { auth, storage, ref, uploadBytesResumable, getDownloadURL } from '../lib/firebase';
import { Upload, X, Check, Loader2 } from 'lucide-react';

interface FileUploaderProps {
  onUploadComplete: (url: string) => void;
  folder?: string;
  accept?: string;
  label?: string;
}

export default function FileUploader({ onUploadComplete, folder = 'uploads', accept = 'image/*', label = 'Upload File' }: FileUploaderProps) {
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const processImage = (file: File): Promise<Blob | File> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/') || file.type === 'image/gif') {
        resolve(file);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimensions for optimization
          const MAX_WIDTH = 2560;
          const MAX_HEIGHT = 2560;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            if (width > height) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            } else {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                // If original file is smaller than processed (rare but possible with high compression), keep original
                if (blob.size > file.size) {
                  resolve(file);
                } else {
                  resolve(blob);
                }
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            0.85 // High quality, low file size
          );
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setProgress(0);

    const processedFile = await processImage(file);
    
    const extension = file.name.split('.').pop() || 'jpg';
    const baseName = file.name.split('.')[0];
    const fileName = `${Date.now()}-${baseName}.${file.type.startsWith('image/') && file.type !== 'image/gif' ? 'jpg' : extension}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);
    console.log('Initiating upload to:', `${folder}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, processedFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(p);
        console.log('Upload progress:', p);
      },
      (err) => {
        console.error('Upload task error logic:', err);
        if (err.code === 'storage/unauthorized') {
          setError(`Upload failed: Unauthorized. Please ensure your Firebase Storage rules allow writes to '${folder}/'. Current User: ${auth.currentUser?.email || 'Not logged in'}`);
        } else {
          setError(`Upload failed: ${err.message || 'Unknown error'}`);
        }
        setUploading(false);
      },
      () => {
        console.log('Upload successful, getting URL...');
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('Download URL:', downloadURL);
          onUploadComplete(downloadURL);
          setUploading(false);
          setProgress(0);
        }).catch(err => {
          console.error('Error getting download URL:', err);
          setError('Failed to retrieve file URL.');
          setUploading(false);
        });
      }
    );
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest block">{label}</label>
      <div className="relative">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
        />
        <div className={`border-2 border-dashed p-4 rounded-sm transition-colors flex flex-col items-center justify-center space-y-2 ${uploading ? 'bg-gray-50 border-brand-gold' : 'bg-white border-gray-200 hover:border-brand-gold'}`}>
          {uploading ? (
            <>
              <Loader2 className="animate-spin text-brand-gold" size={24} />
              <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden mt-2">
                <div 
                  className="bg-brand-gold h-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-brand-gold uppercase">{Math.round(progress)}% Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="text-gray-400" size={24} />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">
                Click or Drop to {label}
              </span>
            </>
          )}
        </div>
      </div>
      {error && <p className="text-[10px] text-red-500 font-bold uppercase">{error}</p>}
    </div>
  );
}
