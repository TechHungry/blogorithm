'use client';

import React, {useState} from 'react';

export default function CollaborateForm(): React.ReactNode {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [topic, setTopic] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        // Add collaboration request logic here
        console.log('Collaboration request submitted:', {name, email, topic});
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className={`flex flex-row gap-2`}>
                <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-[#161515] border border-[#872341] rounded-lg p-2 text-white w-full"
                    required
                />
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#161515] border border-[#872341] rounded-lg p-2 text-white w-full"
                    required
                />
            </div>
            <input
                type="text"
                placeholder="Proposed Blog Topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-[#161515] border border-[#872341] rounded-lg p-2 text-white w-full"
                required
            />
            <button type="submit"
                    className="bg-[#872341] rounded-lg p-2 text-white w-full mt-2 border border-[#872341] hover:bg-[#161515]">
                Submit Request
            </button>
        </form>
    );
}