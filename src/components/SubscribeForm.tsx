'use client';

import React, { useState } from 'react';

export default function SubscribeForm(): any {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        // Add submit logic here
        console.log('Email submitted:', email);
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col'>
            <input
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='bg-[#161515] border border-[#872341] rounded-lg p-2 text-white w-full'
                required
            />
            <button type='submit' className='bg-[#872341] rounded-lg p-2 text-white w-full mt-2 hover:border hover:border-[#872341] hover:bg-[#161515]'>
                Subscribe
            </button>
        </form>
    );
}