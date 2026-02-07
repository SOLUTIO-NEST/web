import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export default function Input({ label, className = "", ...props }: InputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                    {label}
                </label>
            )}
            <input
                className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all ${className}`}
                {...props}
            />
        </div>
    );
}
