import { type HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    noPadding?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className = "", noPadding = false, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${noPadding ? "" : "p-6"
                    } ${className}`}
                {...props}
            />
        );
    }
);

Card.displayName = "Card";

export default Card;
