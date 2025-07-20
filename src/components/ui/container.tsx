import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const containerVariants = cva(
  "mx-auto px-4 sm:px-6 lg:px-8",
  {
    variants: {
      size: {
        default: "max-w-7xl",
        sm: "max-w-3xl",
        md: "max-w-5xl",
        lg: "max-w-7xl",
        xl: "max-w-[90rem]",
        full: "max-w-full",
      },
      padding: {
        default: "py-8",
        none: "py-0",
        sm: "py-4",
        md: "py-6",
        lg: "py-12",
        xl: "py-16",
      },
    },
    defaultVariants: {
      size: "default",
      padding: "default",
    },
  }
);

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(containerVariants({ size, padding, className }))}
      {...props}
    />
  )
);
Container.displayName = "Container";

export { Container }; 