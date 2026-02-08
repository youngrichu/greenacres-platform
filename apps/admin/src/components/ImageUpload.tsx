import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Film } from 'lucide-react';
import { Button } from '@greenacres/ui';
import { getFirebaseStorage } from '@greenacres/db';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

interface ImageUploadProps {
    value: string | string[];
    onChange: (value: string | string[]) => void;
    multiple?: boolean;
    folder?: string;
    label?: string;
    type?: 'image' | 'video';
}

export function ImageUpload({
    value,
    onChange,
    multiple = false,
    folder = 'uploads',
    label = 'Upload Image',
    type = 'image'
}: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Normalize value to array for display
    const values = Array.isArray(value) ? value : (value ? [value] : []);

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
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleUpload(files);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            handleUpload(files);
        }
    };

    const handleUpload = async (files: File[]) => {
        setIsUploading(true);
        setUploadProgress(0);

        try {
            const storage = getFirebaseStorage();

            // Debug Auth State
            // import { getAuth } from 'firebase/auth'; 
            // const auth = getAuth();
            // console.log("Current User:", auth.currentUser);

            const uploadedUrls: string[] = [];
            const totalBytes = files.reduce((acc, file) => acc + file.size, 0);
            let uploadedBytes = 0;

            for (const file of files) {
                // Create a unique filename
                const timestamp = Date.now();
                const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
                const storageRef = ref(storage, `${folder}/${timestamp}_${cleanName}`);

                const uploadTask = uploadBytesResumable(storageRef, file);

                await new Promise<void>((resolve, reject) => {
                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            const bytesTransferred = snapshot.bytesTransferred;
                            // console.log(`Upload progress: ${bytesTransferred} / ${snapshot.totalBytes}`);
                        },
                        (error) => {
                            console.error("Firebase Storage Error:", error);
                            reject(error);
                        },
                        () => resolve()
                    );
                });

                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                uploadedUrls.push(downloadURL);
                uploadedBytes += file.size;
                setUploadProgress((uploadedBytes / totalBytes) * 100);
            }

            if (multiple) {
                onChange([...values, ...uploadedUrls]);
            } else {
                onChange(uploadedUrls[0]);
            }
        } catch (error: any) {
            console.error("Upload failed details:", error);
            // Show detailed error in alert for user feedback
            alert(`Upload failed: ${error.message || error.code || 'Unknown error'}`);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = (index: number) => {
        if (multiple) {
            const newValues = [...values];
            newValues.splice(index, 1);
            onChange(newValues);
        } else {
            onChange('');
        }
    };

    return (
        <div className="space-y-4">
            <div
                className={`
                    border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                    ${isDragging
                        ? 'border-gold bg-gold/10 scale-[1.02]'
                        : 'border-white/10 hover:border-gold/50 hover:bg-white/5'
                    }
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple={multiple}
                    accept={type === 'image' ? "image/*" : "video/*"}
                    onChange={handleFileSelect}
                />

                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                        {isUploading ? (
                            <Loader2 className="w-6 h-6 text-gold animate-spin" />
                        ) : (
                            <Upload className="w-6 h-6 text-cream/60" />
                        )}
                    </div>
                    <div>
                        <p className="text-cream font-medium">
                            {isUploading ? 'Uploading...' : `Click to upload ${multiple ? 'files' : 'a file'}`}
                        </p>
                        <p className="text-cream/40 text-sm mt-1">
                            {isUploading
                                ? `${Math.round(uploadProgress)}% complete`
                                : 'or drag and drop here'
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Preview Grid */}
            {values.length > 0 && (
                <div className={`grid gap-4 ${multiple ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}`}>
                    {values.map((url, index) => (
                        <div key={index} className="relative group aspect-video rounded-lg overflow-hidden bg-black/20 border border-white/10">
                            {type === 'image' ? (
                                <img src={url} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Film className="w-8 h-8 text-cream/40" />
                                </div>
                            )}

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove(index);
                                }}
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* URL overlay for reference */}
                            <div className="absolute bottom-0 inset-x-0 p-2 bg-black/60 text-[10px] text-cream/60 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                {url}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
