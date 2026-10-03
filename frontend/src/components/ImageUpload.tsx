import React, { useRef, useState } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { CameraModal } from './CameraModal';

interface ImageUploadProps {
  selectedFile: File | null;
  previewUrl: string | null;
  onSelectFile: (file: File | null) => void;
  description: string;
  onChangeDescription: (desc: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  selectedFile,
  previewUrl,
  onSelectFile,
  description,
  onChangeDescription,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const validateAndSetFile = (file: File) => {
    setUploadError(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type) && !/\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
      setUploadError('Invalid file type. Please upload JPG, JPEG, PNG, or WEBP images.');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setUploadError('File size exceeds 12MB. Please select a smaller photo.');
      return;
    }
    onSelectFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Dropzone or Preview Area */}
      {!previewUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 ${
            isDragging
              ? 'border-slate-900 bg-slate-100 scale-[1.01]'
              : 'border-slate-300/80 bg-white hover:border-slate-400 hover:bg-slate-50/80 shadow-xs'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Upload Icon Circle */}
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <UploadCloud className="w-8 h-8 text-slate-700 group-hover:text-slate-900" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-1">
                Drag & drop your image here
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                or <span className="font-semibold text-slate-900 underline underline-offset-2">browse files</span> from your computer
              </p>
              <p className="text-xs text-slate-400 mt-2 font-mono-code">
                JPG · PNG · WEBP · Up to 12MB
              </p>
            </div>

            {/* Live Camera Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCameraOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/90 font-semibold text-xs rounded-full shadow-xs transition-all duration-200 hover:scale-102"
              >
                <Camera className="w-4 h-4 text-slate-700" />
                <span>Use Live Camera</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Image Preview Box */
        <div className="relative rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative aspect-video sm:aspect-[21/9] w-full bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200">
            <img
              src={previewUrl}
              alt="Uploaded visual problem"
              className="max-h-full max-w-full object-contain"
            />
            {/* Bottom Bar Info & Action */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-slate-300" />
                <span className="text-xs font-mono-code text-slate-200 truncate max-w-[200px] sm:max-w-xs">
                  {selectedFile?.name || 'preset_problem_image.png'}
                </span>
                <span className="text-[10px] text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
                  {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'Preset Image'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onSelectFile(null)}
                className="flex items-center gap-1 text-xs text-rose-300 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 px-3 py-1 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-medium shadow-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Description Input */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-mono-code">
          What is happening? <span className="font-sans font-normal text-slate-400 capitalize">(optional)</span>
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => onChangeDescription(e.target.value)}
          placeholder="e.g. The LED isn't turning on, motor makes a clicking sound, or pandas import error in terminal..."
          className="w-full bg-white border border-slate-200/90 focus:border-slate-900 rounded-2xl p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs transition-all resize-none"
        />
        <p className="text-[11px] text-slate-400">
          The photo is the primary input. Optional text provides extra context for Gemma 4.
        </p>
      </div>

      {/* Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(file) => {
          validateAndSetFile(file);
          setIsCameraOpen(false);
        }}
      />
    </div>
  );
};
