import React, { ReactNode } from 'react';

interface ColumnProps {
    children: ReactNode;
}

export default function Column({ children }: ColumnProps) {
    return (
        <div className="mx-auto lg:px-8 container mt-16">
            {children}
        </div>
    );
}
