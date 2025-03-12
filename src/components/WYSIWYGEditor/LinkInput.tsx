'use client';

import { useState } from 'react';

interface InputProps {
    exec: (cmd: string, arg: string) => void;
    onClose: () => void;
}

const LinkInput = ({ exec, onClose }: InputProps) => {
    const [url, setUrl] = useState('');

    const insertLink = () => {
        if (url) exec('createLink', url);
        onClose();
    };

    return (
        <div className="absolute p-4 bg-gray-900 border border-gray-700 shadow-lg rounded">
            <input
                className="border border-gray-600 bg-gray-800 text-gray-100 p-2 rounded"
                placeholder="Enter link URL"
                value={url}
                onChange={e => setUrl(e.target.value)}
            />
            <button className="ml-2 p-2 bg-blue-600 text-white rounded" onClick={insertLink}>
                Insert
            </button>
        </div>
    );
};

export default LinkInput;