'use client';

import React, {useEffect, useRef, useState, DragEvent, ChangeEvent, ClipboardEvent} from 'react';
import Toolbar from './Toolbar';
import './EditorStyles.css';

const WYSIWYGEditor = () => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]); // New state for tags
    const [tagInput, setTagInput] = useState<string>(''); // New state for tag input
    const [summary, setSummary] = useState<string>(''); // New state for summary
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const tagInputRef = useRef<HTMLInputElement>(null);

    // Helper to handle a file object
    const handleFile = (file: File) => {
        if (!file) return;
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    // File input onChange
    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    // Drag and drop events
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    // Clipboard (paste) event
    const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
        const items = e.clipboardData?.items;
        if (items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].kind === 'file') {
                    const file = items[i].getAsFile();
                    if (file) handleFile(file);
                }
            }
        }
    };

    const handleRemove = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl); // Clean up the object URL
        }
        setImageFile(null);
        setPreviewUrl('');
    };

    // Tag input handlers
    const handleTagInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
            // Remove the last tag when backspace is pressed and input is empty
            setTags(tags.slice(0, -1));
        }
    };

    const removeTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    const handleTagContainerClick = () => {
        tagInputRef.current?.focus();
    };

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.contentEditable = 'true';
            editorRef.current.spellcheck = true;

            // Add placeholder handling
            const handleFocus = () => {
                if (editorRef.current?.innerHTML === '') {
                    editorRef.current.classList.remove('empty');
                }
            };

            const handleBlur = () => {
                if (editorRef.current?.innerHTML === '') {
                    editorRef.current.classList.add('empty');
                }
            };

            // Initialize with empty class if no content
            if (editorRef.current.innerHTML === '') {
                editorRef.current.classList.add('empty');
            }

            editorRef.current.addEventListener('focus', handleFocus);
            editorRef.current.addEventListener('blur', handleBlur);

            // Save content on input
            const handleInput = () => {
                if (editorRef.current) {
                    setContent(editorRef.current.innerHTML);
                }
            };

            editorRef.current.addEventListener('input', handleInput);
            editorRef.current.focus();

            return () => {
                editorRef.current?.removeEventListener('focus', handleFocus);
                editorRef.current?.removeEventListener('blur', handleBlur);
                editorRef.current?.removeEventListener('input', handleInput);
            };
        }
    }, []);

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!content || content.trim() === '') {
            alert('Please add some content before submitting');
            return;
        }

        if (!title || title.trim() === '') {
            alert('Please add a title before submitting');
            return;
        }

        setIsSubmitting(true);

        try {
            // Create FormData object instead of JSON
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('summary', summary);

            // Add tags as JSON string
            formData.append('tags', JSON.stringify(tags));

            // Only append the image if it exists
            if (imageFile) {
                formData.append('coverImage', imageFile);
            } else {
                throw new Error('CoverImage is required');
            }

            // Submit to internal API route that connects to Sanity
            const response = await fetch('/api/submit-blog', {
                method: 'POST',
                // Don't set Content-Type header when using FormData
                // The browser will automatically set it to multipart/form-data with the correct boundary
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                console.log('Content submitted successfully to Sanity!', data);
                alert('Your blog post has been submitted successfully!');

            } else {
                throw new Error(data.message || 'Failed to submit content');
            }
        } catch (error) {
            console.error('Error submitting content:', error);
            alert('Failed to submit your blog post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`w-full`}>
            <div className={`py-3 px-2 flex justify-between items-center border-b`}>
                <h1 className={`font-satoshi text-2xl`}>Blogorithm.</h1>
                <button
                    type="submit"
                    className={`font-satoshi bg-[#872341] rounded-lg px-4 py-1 text-white border border-[#872341] hover:border hover:bg-[#161515] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </div>
            <div className={`flex flex-col w-full`}>
                <div className={`flex flex-row justify-between items-center my-2 gap-x-8`}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-[#161515] border border-[#872341] rounded-lg p-2 text-white w-1/2"
                        required
                    />
                    <div
                        className="border border-[#872341] bg-[#161515] rounded p-2 flex items-center justify-between w-1/2"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onPaste={handlePaste}
                    >
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="max-h-8 mb-2 object-contain"
                            />
                        ) : (
                            <p className="text-gray-500 ">Drag or paste image here</p>
                        )}
                        <div className={`flex space-x-2`}>
                            <div className="">
                                <label
                                    htmlFor="imageInput"
                                    className="cursor-pointer font-satoshi bg-[#872341] rounded-lg px-4 py-1 text-white border border-[#872341] hover:border hover:bg-[#161515] transition"
                                >
                                    Upload
                                </label>
                                <input
                                    type="file"
                                    id="imageInput"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />
                            </div>
                            <div className="">
                                {previewUrl && (
                                    <button
                                        onClick={handleRemove}
                                        className="cursor-pointer font-satoshi bg-[#872341] rounded-lg px-4 py-1 text-white border border-[#872341] hover:border hover:bg-[#161515] transition"
                                    >
                                        x
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* New row with Tags and Summary */}
                <div className={`flex flex-row justify-between items-center mb-4 gap-x-8`}>



                    {/* Summary input */}
                    <textarea
                        placeholder="Summary"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        className="bg-[#161515] border border-[#872341] rounded-lg p-2 text-white w-1/2 h-20 resize-none"
                    />

                    {/* Tags input */}
                    <div
                        className="w-1/2 h-20 p-1 border border-[#872341] rounded-md flex flex-wrap bg-[#161515] focus-within:ring-2 focus-within:ring-[#872341] focus-within:border-[#872341]"
                        onClick={handleTagContainerClick}
                    >
                        {tags.map((tag, index) => (
                            <div
                                key={index}
                                className="flex items-center bg-[#872341] bg-opacity-30 text-white text-sm font-medium mr-2 mb-2 px-2 py-1 rounded-md"
                            >
                                <span className="mr-1">{tag}</span>
                                <button
                                    type="button"
                                    onClick={() => removeTag(index)}
                                    className="text-white hover:text-gray-300 focus:outline-none"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                        <input
                            ref={tagInputRef}
                            type="text"
                            value={tagInput}
                            onChange={handleTagInputChange}
                            onKeyDown={handleTagKeyDown}
                            className="flex-grow min-w-[120px] outline-none p-1 mb-2 text-sm bg-transparent text-white"
                            placeholder={tags.length === 0 ? "Add tags..." : ""}
                        />
                    </div>
                </div>
            </div>
            <div
                className="overflow-hidden shadow-xl bg-gray-800 bg-opacity-30 text-white border border-gray-700 flex flex-col h-[calc(100vh-200px)]">
                <Toolbar editorRef={editorRef}/>
                <div
                    ref={editorRef}
                    className="p-4 flex-1 overflow-y-auto outline-none text-gray-100 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-500 empty:before:italic"
                    data-placeholder="Start writing something amazing..."
                />
            </div>
        </div>
    );
};

export default WYSIWYGEditor;