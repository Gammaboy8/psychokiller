'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface ManagedImage {
  id?: string;          // db id (existing) — absent for freshly uploaded
  storage_path: string;
  public_url: string;
  is_primary: boolean;
  sort_order: number;
}

const BUCKET = 'listing-images';

async function compress(file: File): Promise<Blob> {
  // Downscale large images client-side to <=1600px, output webp when possible.
  try {
    const bitmap = await createImageBitmap(file);
    const max = 1600;
    let { width, height } = bitmap;
    if (width > max || height > max) {
      const scale = max / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    return await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b || file), 'image/webp', 0.85)
    );
  } catch {
    return file;
  }
}

export function ImageManager({
  accountKey,
  images,
  onChange,
}: {
  accountKey: string; // used to namespace storage paths
  images: ManagedImage[];
  onChange: (imgs: ManagedImage[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const supabase = createClient();

  const handleFiles = async (files: FileList | File[]) => {
    setError('');
    setUploading(true);
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    const added: ManagedImage[] = [];
    let order = images.length;
    for (const file of list) {
      const blob = await compress(file);
      const ext = blob.type === 'image/webp' ? 'webp' : file.name.split('.').pop() || 'png';
      const path = `${accountKey}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, blob, { contentType: blob.type, upsert: false });
      if (upErr) {
        setError(`Upload failed: ${upErr.message}`);
        continue;
      }
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      added.push({
        storage_path: path,
        public_url: data.publicUrl,
        is_primary: false,
        sort_order: order++,
      });
    }
    const next = [...images, ...added];
    if (next.length && !next.some((i) => i.is_primary)) next[0].is_primary = true;
    onChange(next);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeImg = async (idx: number) => {
    const img = images[idx];
    // best-effort storage cleanup
    await supabase.storage.from(BUCKET).remove([img.storage_path]).catch(() => {});
    const next = images.filter((_, i) => i !== idx).map((im, i) => ({ ...im, sort_order: i }));
    if (next.length && !next.some((i) => i.is_primary)) next[0].is_primary = true;
    onChange(next);
  };

  const setPrimary = (idx: number) =>
    onChange(images.map((im, i) => ({ ...im, is_primary: i === idx })));

  const move = (idx: number, dir: number) => {
    const j = idx + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next.map((im, i) => ({ ...im, sort_order: i })));
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors ${
          dragOver ? 'border-crimson-500 bg-crimson-500/5' : 'border-ink-600 hover:border-ink-500'
        }`}
      >
        <p className="text-sm text-gray-300">
          {uploading ? 'Uploading…' : 'Drag & drop images here, or click to select'}
        </p>
        <p className="mt-1 text-xs text-muted">Auto-compressed to WebP. First image = primary by default.</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {error && <p className="mt-2 text-sm text-crimson-300">{error}</p>}

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, idx) => (
            <div key={img.public_url} className="card overflow-hidden">
              <div className="relative aspect-square bg-ink-900">
                <Image src={img.public_url} alt="" fill sizes="200px" className="object-cover" />
                {img.is_primary && (
                  <span className="absolute left-1 top-1 badge-featured">Primary</span>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1 p-1.5">
                <button type="button" onClick={() => move(idx, -1)} className="btn-ghost btn-sm px-2">←</button>
                <button type="button" onClick={() => move(idx, 1)} className="btn-ghost btn-sm px-2">→</button>
                {!img.is_primary && (
                  <button type="button" onClick={() => setPrimary(idx)} className="btn-ghost btn-sm px-2">★</button>
                )}
                <button type="button" onClick={() => removeImg(idx)} className="btn-ghost btn-sm px-2 text-crimson-400">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
