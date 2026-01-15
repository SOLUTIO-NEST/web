import { type HTMLAttributes } from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "outline";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700",
    outline: "border border-gray-200 text-gray-600 bg-transparent",
};

export default function Badge({ variant = "default", className = "", ...props }: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
            {...props}
        />
    );
}
