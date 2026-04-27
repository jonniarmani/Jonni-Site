import React, { useState } from 'react';
import { storage, ref, uploadBytesResumable, getDownloadURL } from '../lib/firebase';
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setProgress(0);

    const fileName = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(p);
      },
      (err) => {
        console.error('Upload error:', err);
        setError('Upload failed. Please check permissions.');
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onUploadComplete(downloadURL);
          setUploading(false);
          setProgress(0);
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
