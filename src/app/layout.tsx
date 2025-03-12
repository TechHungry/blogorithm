// src/app/layout.tsx
import {Providers} from './providers';
import './globals.css';

export const metadata = {
    title: 'Blogorithm',
    description: 'A platform for authorized writers to create tech blog posts',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}