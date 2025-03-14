// src/app/write/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WritePage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the new profile page
        router.push('/profile');
    }, [router]);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#872341]"></div>
        </div>
    );
}