// app/tools/image-compressor/ImageCompressorClient.tsx
"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';
import Link from 'next/link';
import {
  Image as ImageIcon,
  Upload,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Settings,
  FileImage,
  HardDrive,
  ArrowRight,
  Zap,
  MoveHorizontal,
  X,
  Plus,
} from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '800'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

interface CompressedImage {
  id: string;
  originalFile: File;
  compressedBlob: Blob | null;
  originalSize: string;
  compressedSize: string;
  compressionRatio: number;
  originalUrl: string;
  compressedUrl: string;
  width: number;
  height: number;
}

export default function ImageCompressorClient() {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<CompressedImage | null>(null);
  const [quality, setQuality] = useState(80);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const compressImage = useCallback((file: File, targetQuality: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas not supported'));
            return;
          }
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Compression failed'));
            },
            mimeType,
            targetQuality / 100
          );
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setIsProcessing(true);

    const newImages: CompressedImage[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        setError(`"${file.name}" is not an image file.`);
        continue;
      }

      try {
        const [compressedBlob, dimensions] = await Promise.all([
          compressImage(file, quality),
          getImageDimensions(file)
        ]);
        const originalSize = formatBytes(file.size);
        const compressedSize = formatBytes(compressedBlob.size);
        const compressionRatio = ((file.size - compressedBlob.size) / file.size) * 100;

        newImages.push({
          id: `${Date.now()}-${Math.random()}`,
          originalFile: file,
          compressedBlob,
          originalSize,
          compressedSize,
          compressionRatio,
          originalUrl: URL.createObjectURL(file),
          compressedUrl: URL.createObjectURL(compressedBlob),
          width: dimensions.width,
          height: dimensions.height,
        });
      } catch (err) {
        setError(`Failed to compress "${file.name}".`);
      }
    }

    setImages(prev => [...prev, ...newImages]);
    if (newImages.length > 0 && !selectedImage) {
      setSelectedImage(newImages[0]);
    }
    setIsProcessing(false);
  }, [quality, compressImage, selectedImage]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleQualityChange = async (newQuality: number) => {
    setQuality(newQuality);
    if (images.length > 0) {
      setIsProcessing(true);
      const updatedImages = await Promise.all(
        images.map(async (img) => {
          try {
            const compressedBlob = await compressImage(img.originalFile, newQuality);
            const compressedSize = formatBytes(compressedBlob.size);
            const compressionRatio = ((img.originalFile.size - compressedBlob.size) / img.originalFile.size) * 100;
            URL.revokeObjectURL(img.compressedUrl);
            return {
              ...img,
              compressedBlob,
              compressedSize,
              compressionRatio,
              compressedUrl: URL.createObjectURL(compressedBlob),
            };
          } catch {
            return img;
          }
        })
      );
      setImages(updatedImages);
      if (selectedImage) {
        const updatedSelected = updatedImages.find(img => img.id === selectedImage.id);
        if (updatedSelected) setSelectedImage(updatedSelected);
      }
      setIsProcessing(false);
    }
  };

  const handleRemove = (id: string) => {
    setImages(prev => {
      const imgToRemove = prev.find(img => img.id === id);
      if (imgToRemove) {
        URL.revokeObjectURL(imgToRemove.originalUrl);
        URL.revokeObjectURL(imgToRemove.compressedUrl);
      }
      const newImages = prev.filter(img => img.id !== id);
      if (selectedImage?.id === id) {
        setSelectedImage(newImages.length > 0 ? newImages[0] : null);
      }
      return newImages;
    });
  };

  const handleDownload = (img: CompressedImage) => {
    if (!img.compressedBlob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(img.compressedBlob);
    link.download = `compressed-${img.originalFile.name}`;
    link.click();
  };

  const handleDownloadAll = () => {
    images.forEach(img => handleDownload(img));
  };

  const handleClearAll = () => {
    images.forEach(img => {
      URL.revokeObjectURL(img.originalUrl);
      URL.revokeObjectURL(img.compressedUrl);
    });
    setImages([]);
    setSelectedImage(null);
  };

  const totalOriginalSize = images.reduce((acc, img) => acc + img.originalFile.size, 0);
  const totalCompressedSize = images.reduce((acc, img) => acc + (img.compressedBlob?.size || 0), 0);
  const totalSavings = totalOriginalSize - totalCompressedSize;
  const savingsPercent = totalOriginalSize > 0 ? (totalSavings / totalOriginalSize) * 100 : 0;

  const handleSliderMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!previewContainerRef.current) return;
    const rect = previewContainerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const startSliderDrag = () => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      handleSliderMove(e as any);
    };
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 text-slate-800">
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent`}>
            DevTools
          </Link>
          <span className={`${poppins.className} text-sm font-medium text-slate-600`}>Image Compressor</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-5 shadow-sm">
            <ImageIcon size={16} /> 100% Private & Client-Side
          </div>
          <h1 className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 leading-tight`}>
            Compress Images <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Instantly</span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
            Reduce file sizes without leaving your browser. Drag & drop, adjust quality, and download optimized images.
          </p>
        </motion.div>

        {images.length === 0 ? (
          <div className="max-w-3xl mx-auto">
            <div
              className={`relative border-2 border-dashed rounded-3xl p-16 text-center transition-all ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50/50'
                  : 'border-slate-300 bg-white/50 hover:border-indigo-400 hover:bg-indigo-50/30'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-5">
                <div className="p-5 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl">
                  <Upload size={40} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-xl font-medium text-slate-800 mb-1">
                    Drag & drop your images here
                  </p>
                  <p className="text-slate-500 mb-4">or</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Browse Files
                  </button>
                </div>
                <p className="text-sm text-slate-400">Supports JPEG, PNG, WebP • Up to 10 images</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <HardDrive size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Savings</p>
                    <p className="text-xl font-bold text-slate-800">
                      {formatBytes(totalSavings)} <span className="text-sm font-normal text-green-600">({savingsPercent.toFixed(1)}%)</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleDownloadAll}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center gap-2"
                  >
                    <Download size={14} /> Download All ({images.length})
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm flex items-center gap-2"
                  >
                    <Trash2 size={14} /> Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Quality Control */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Settings size={18} className="text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Quality</span>
                </div>
                <div className="flex-1 flex items-center gap-4">
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={1}
                    value={quality}
                    onChange={(e) => handleQualityChange(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    disabled={isProcessing}
                  />
                  <span className="text-sm font-mono bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full min-w-[60px] text-center">
                    {quality}%
                  </span>
                </div>
              </div>
            </div>

            {/* Main Preview Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Thumbnails Sidebar */}
              <div className="lg:col-span-1 space-y-3">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Images ({images.length})</h3>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {images.map((img) => (
                    <motion.div
                      key={img.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedImage?.id === img.id
                          ? 'border-indigo-400 bg-indigo-50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                      onClick={() => setSelectedImage(img)}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={img.compressedUrl}
                          alt={img.originalFile.name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{img.originalFile.name}</p>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-slate-500">{img.compressedSize}</span>
                            <span className={`px-1.5 py-0.5 rounded-full ${
                              img.compressionRatio > 50 ? 'bg-green-100 text-green-700' :
                              img.compressionRatio > 20 ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              -{img.compressionRatio.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(img.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Add More Images
                  </button>
                </div>
              </div>

              {/* Preview Panel */}
              <div className="lg:col-span-2">
                {selectedImage ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                      <h3 className="font-semibold text-slate-800">{selectedImage.originalFile.name}</h3>
                      <button
                        onClick={() => handleDownload(selectedImage)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center gap-2"
                      >
                        <Download size={14} /> Download
                      </button>
                    </div>

                    {/* Before/After Slider */}
                    <div
                      ref={previewContainerRef}
                      className="relative aspect-video bg-slate-900 cursor-ew-resize select-none"
                      onMouseDown={startSliderDrag}
                      onTouchStart={startSliderDrag}
                    >
                      {/* Original Image (left side) */}
                      <div className="absolute inset-0 overflow-hidden">
                        <img
                          src={selectedImage.originalUrl}
                          alt="Original"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      
                      {/* Compressed Image (right side) */}
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                      >
                        <img
                          src={selectedImage.compressedUrl}
                          alt="Compressed"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Slider Handle */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
                        style={{ left: `${sliderPosition}%` }}
                      >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                          <MoveHorizontal size={16} className="text-slate-700" />
                        </div>
                      </div>

                      {/* Labels */}
                      <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs font-medium">
                        Original ({selectedImage.originalSize})
                      </div>
                      <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs font-medium">
                        Compressed ({selectedImage.compressedSize})
                      </div>
                    </div>

                    {/* Image Info */}
                    <div className="p-4 grid grid-cols-3 gap-4 text-center border-t border-slate-200">
                      <div>
                        <p className="text-xs text-slate-500">Dimensions</p>
                        <p className="font-mono text-sm text-slate-800">{selectedImage.width} × {selectedImage.height}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Original</p>
                        <p className="font-mono text-sm text-slate-800">{selectedImage.originalSize}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Compressed</p>
                        <p className="font-mono text-sm text-green-700 font-medium">{selectedImage.compressedSize}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                    <FileImage size={48} className="text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Select an image to preview</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Error Toast */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 text-red-700 z-50"
            >
              <AlertCircle size={18} />
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-2">
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4">
                <RefreshCw size={32} className="animate-spin text-indigo-600" />
                <p className="font-medium text-slate-700">Processing images...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-slate-200/60 py-8 mt-12 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} DevTools. Built with ❤️ for developers.
        </div>
      </footer>
    </div>
  );
}