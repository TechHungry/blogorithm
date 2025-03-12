// src/app/write/page.tsx
'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import WYSIWYGEditor from '@/components/WYSIWYGEditor/WYSIWYGEditor';

// Using dynamic import with ssr: false to completely skip server-side rendering
const DynamicEditor = dynamic(() => Promise.resolve(WYSIWYGEditor), {
    ssr: false,
    loading: () => (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#872341]"></div>
        </div>
    )
});

export default function WritePage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#872341]"></div>
            </div>
        }>
            <div className="w-full mx-auto px-4">
                <DynamicEditor />
            </div>
        </Suspense>
    );
}