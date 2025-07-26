import React, { useEffect, useRef, useState, forwardRef } from "react";
// import { cn } from "../lib/utils";
import { X } from "lucide-react";
import { cva } from "class-variance-authority";
const cn = (...classes) => classes.filter(Boolean).join(" ");

/* Toast Components */
const ToastProvider = ({ children }) => {
  return <div className="toast-provider">{children}</div>;
};

// Progress Component - added here to fix the import error
const Progress = ({ value = 0, className = '', indicatorClassName = '' }) => {
  return (
    <div className={`relative h-1 w-full overflow-hidden rounded-full ${className}`}>
      <div
        className={`h-full w-full flex-1 transition-all ${indicatorClassName}`}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  );
};

const ToastViewport = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      `fixed z-[40] flex flex-col-reverse gap-2 right-4 top-4 w-auto max-w-sm`,
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = "ToastViewport";

const toastVariants = cva(
  `group relative flex w-96 items-center justify-between overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all 
  bg-background text-foreground`,
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "border-red-500 bg-red-100 text-red-800",
        success: "border-green-500 bg-green-100 text-green-800",
        warning: "border-yellow-500 bg-yellow-100 text-yellow-800",
        info: "border-blue-500 bg-blue-100 text-blue-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = forwardRef(({ className, variant = "default", duration = 5000, onClose, ...props }, ref) => {
  const [progress, setProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const startTime = Date.now();
    const endTime = startTime + duration;

    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(0);

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const timeLeft = Math.max(0, endTime - now);
      const newProgress = 100 - (timeLeft / duration) * 100;

      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(intervalRef.current);
        setTimeout(() => {
          setIsOpen(false);
          onClose?.();
        }, 100);
      }
    }, 10);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn(toastVariants({ variant }), "relative z-50 pb-2", className)}
      style={{
        marginBottom: "8px",
        zIndex: 51,
      }}
      {...props}
    >
      <div className="w-full min-h-8">
        {props.children}
        <div className="absolute bottom-0 left-0 right-0 h-1">
          <Progress
            value={progress}
            className="h-1 rounded-none"
            indicatorClassName={cn(
              variant === "destructive"
                ? "bg-red-600"
                : variant === "success"
                ? "bg-green-600"
                : variant === "warning"
                ? "bg-yellow-600"
                : variant === "info"
                ? "bg-blue-600"
                : "bg-gray-600"
            )}
          />
        </div>
      </div>

      <ToastClose
        onClick={() => {
          setIsOpen(false);
          onClose?.();
        }}
      />
    </div>
  );
});
Toast.displayName = "Toast";

const ToastClose = forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/70 opacity-70 transition-opacity hover:text-foreground hover:opacity-100",
      className
    )}
    aria-label="Close toast"
    {...props}
  >
    <X className="h-4 w-4" />
  </button>
));
ToastClose.displayName = "ToastClose";

const ToastTitle = forwardRef(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
));
ToastTitle.displayName = "ToastTitle";

const ToastDescription = forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
));
ToastDescription.displayName = "ToastDescription";

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
};
