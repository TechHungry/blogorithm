// src/components/PostBody/PostBody.tsx
'use client';
import './PostBody.module.css';
import { useState, useRef, useEffect } from "react";
// When you're ready to implement syntax highlighting:
// import DOMPurify from "isomorphic-dompurify";
// import { CodeBlock } from "./CodeBlock";

type PostBodyProps = {
    body: string;
}

export function PostBody({ body }: PostBodyProps) {
    const [modalImage, setModalImage] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!contentRef.current) return;

        const handleImageClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'IMG') {
                setModalImage((target as HTMLImageElement).src);
            }
        };

        const contentElement = contentRef.current;
        contentElement.addEventListener('click', handleImageClick);

        return () => {
            contentElement.removeEventListener('click', handleImageClick);
        };
    }, []);

    return (
        <div className="mx-auto">
            <article
                ref={contentRef}
                className="prose prose-invert max-w-none
                  prose-headings:font-funnel prose-h1:font-satoshi
                  prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                  prose-img:mx-auto prose-img:max-h-[500px] prose-img:rounded prose-img:cursor-pointer
                  prose-pre:bg-gray-800 prose-pre:p-4 prose-pre:rounded prose-pre:overflow-x-auto
                  prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                  prose-pre:prose-code:bg-transparent prose-pre:prose-code:p-0
                  prose-blockquote:border-l-4 prose-blockquote:border-gray-400 prose-blockquote:pl-4 prose-blockquote:italic
                  prose-hr:my-6 prose-hr:border-gray-300"
                dangerouslySetInnerHTML={{ __html: body }}
            />

            {modalImage && (
                <div
                    className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
                    onClick={() => setModalImage(null)}
                >
                    <div className="relative max-w-[90vw] max-h-[90vh]">
                        <img
                            src={modalImage}
                            alt="Enlarged view"
                            className="max-w-full max-h-[90vh] object-contain"
                        />
                        <button
                            className="absolute top-4 right-4 text-white text-2xl bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
                            onClick={(e) => {
                                e.stopPropagation();
                                setModalImage(null);
                            }}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}