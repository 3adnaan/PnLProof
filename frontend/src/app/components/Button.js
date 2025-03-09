'use client';

import { useRouter } from 'next/navigation';

export default function Button({ text, href }) {
    const router = useRouter();

    const handleClick = () => {
        router.push(href);  // Navigate to the provided 'href'
    };

    return (
        <button className="btn" onClick={handleClick}>
            {text}
        </button>
    );
}
