"use client";
import { useState, useEffect } from 'react';

const CursorGradient = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setPosition({ x: event.clientX, y: event.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div
            className="background-animation"
            style={{
                background: `radial-gradient(circle at ${position.x}px ${position.y}px, rgba(209, 10, 10, 0.25), transparent 30%)`,
            }}
        />
    );
};

export default CursorGradient;