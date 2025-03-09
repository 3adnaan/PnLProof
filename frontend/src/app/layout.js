'use client';
import './styles/globals.css';

export default function Layout({ children }) {
    return (
        <html lang="en">
            <body className="bg-yellow-50 text-gray-900">
                {/* Removed the navigation links here */}
                <main className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
                    {children}
                </main>
            </body>
        </html>
    );
}
