'use client';

import { useRef } from 'react';

interface InputProps {
    exec: (cmd: string, arg: string) => void;
    onClose: () => void;
}

const ImageInput = ({ exec, onClose }: InputProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const insertImage = () => {
        const file = fileInputRef.current?.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target?.result as string;
                exec('insertImage', imageUrl);
                onClose();
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="absolute z-50 p-4 bg-gray-900 border border-gray-700 shadow-lg rounded">
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="text-gray-200"
            />
            <button
                className="ml-2 p-2 bg-blue-600 text-white rounded"
                onClick={insertImage}
            >
                Upload & Insert
            </button>
            <button
                className="ml-2 p-2 bg-red-600 text-white rounded"
                onClick={onClose}
            >
                Cancel
            </button>
        </div>
    );
};

export default ImageInput;