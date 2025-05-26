'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '../components/ImageUploader';

export default function ProfileEditPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // 初期値読み込み用
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // ✅ ユーザー情報を取得して初期値にセット
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) throw new Error('ユーザー情報の取得に失敗しました');
        const data = await res.json();
        setName(data.name || '');
        setIconUrl(data.iconUrl || '');
        setBio(data.bio || '');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      let finalIconUrl = iconUrl;
      if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const uploadRes = await fetch('/api/profile/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData.message || '画像アップロードに失敗しました');
      }

      finalIconUrl = uploadData.url;
      }
      
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, iconUrl: finalIconUrl, bio }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || '更新に失敗しました');
      }
      router.push('/profile');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
      router.refresh();
    }
  };

  if (loading) {
    return <div className="text-center py-10">読み込み中...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-purple-700">プロフィールを編集</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <ImageUploader
          currentImage={iconUrl}
          onFileSelect={(file) => setSelectedFile(file)}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">名前</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">自己紹介文</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            placeholder="自己紹介を記入..."
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? '保存中...' : '保存'}
        </button>
      </form>
    </div>
  );
}
