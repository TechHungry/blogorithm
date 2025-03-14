// src/components/avatar.tsx
'use client';

import DateFormatter from "@/components/date-formatter";

type Props = {
    name: string;
    picture?: string;
    date: string;
};

const Avatar = ({ name, picture, date }: Props) => {
    // Generate initials for placeholder
    const initials = name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    return (
        <div className="flex items-center">
            <div className="relative mr-4">
                {picture ? (
                    <>
                        <img
                            src={picture}
                            className="w-10 h-10 rounded-full object-cover"
                            alt={name}
                            onError={(e) => {
                                e.currentTarget.onerror = null; // Prevent infinite error loop
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.parentElement?.querySelector('.avatar-fallback');
                                if (fallback) {
                                    (fallback as HTMLElement).style.display = 'flex';
                                }
                            }}
                        />
                        {/* Hidden fallback that becomes visible on image error */}
                        <div
                            className="avatar-fallback w-10 h-10 rounded-full bg-[#872341] text-white flex items-center justify-center font-bold text-sm absolute top-0 left-0"
                            style={{ display: 'none' }}
                        >
                            {initials}
                        </div>
                    </>
                ) : (
                    <div
                        className="w-10 h-10 rounded-full bg-[#872341] text-white flex items-center justify-center font-bold text-sm"
                        aria-label={`${name}'s profile picture`}
                    >
                        {initials}
                    </div>
                )}
            </div>

            <div className="flex flex-col">
                <div className="text-lg font-bold">{name}</div>
                <DateFormatter dateString={date}/>
            </div>
        </div>
    );
};

export default Avatar;