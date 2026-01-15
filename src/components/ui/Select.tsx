import { type SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, className = "", children, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        className={`w-full appearance-none border rounded-lg px-4 py-2 pr-10 bg-white transition-colors duration-200 outline-none focus:ring-2 disabled:bg-gray-100 disabled:text-gray-500 ${error
                            ? "border-red-400 focus:ring-red-300 focus:border-red-400"
                            : "border-gray-300 focus:ring-purple-400 focus:border-purple-500"
                            } ${className}`}
                        {...props}
                    >
                        {children}
                    </select>
                    <ChevronDown
                        size={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    />
                </div>
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
        );
    }
);

Select.displayName = "Select";

export default Select;
