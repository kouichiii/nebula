'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  currentImage?: string | null;
  onFileSelect: (file: File) => void;
}

export default function ImageUploader({ currentImage, onFileSelect }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);

      // プレビューURLを生成
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const imageToShow = previewUrl || currentImage;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32">
        {imageToShow ? (
          <Image
            src={imageToShow}
            alt="Profile"
            fill
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="text-purple-600 hover:text-purple-700"
      >
        画像を選択
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleSelect}
        className="hidden"
      />
    </div>
  );
}
