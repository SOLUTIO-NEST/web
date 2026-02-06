import type { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    noPadding?: boolean;
}

export default function Card({ children, className = "", noPadding = false }: CardProps) {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden ${className}`}>
            <div className={noPadding ? "" : "p-6"}>
                {children}
            </div>
        </div>
    );
}
