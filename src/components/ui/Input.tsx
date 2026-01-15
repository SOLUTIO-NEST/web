import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = "", ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`w-full border rounded-lg px-4 py-2 bg-white transition-colors duration-200 outline-none focus:ring-2 disabled:bg-gray-100 disabled:text-gray-500 ${error
                        ? "border-red-400 focus:ring-red-300 focus:border-red-400"
                        : "border-gray-300 focus:ring-purple-400 focus:border-purple-500"
                        } ${className}`}
                    {...props}
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
