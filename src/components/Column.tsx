import React, { ReactNode } from 'react';

interface ColumnProps {
    children: ReactNode;
    classes?: string;
}

export default function Column({ children, classes='' }: ColumnProps) {
    return (
        <div className={`mx-auto lg:px-8 container ${classes}`}>
            {children}
        </div>
    );
}
