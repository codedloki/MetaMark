import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
// import { cn } from "../lib/utils"; // Make sure this utility exists
import { BadgeX } from "lucide-react";

const cn = (...classes) => classes.filter(Boolean).join(" ");
// 💡 Context setup
const PopoverContext = React.createContext(undefined);

// 🌟 Popover Wrapper
const Popover = ({ children, defaultOpen = false, open: controlledOpen, onOpenChange }) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = useCallback(
    (value) => {
      const newValue = typeof value === "function" ? value(open) : value;

      if (!isControlled) {
        setUncontrolledOpen(newValue);
      }

      if (onOpenChange) {
        onOpenChange(newValue);
      }
    },
    [isControlled, onOpenChange, open]
  );

  // 👀 Close when clicking outside
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      const popoverContents = document.querySelectorAll("[data-popover-content]");
      let isClickInside = false;

      popoverContents.forEach((content) => {
        if (content.contains(event.target)) {
          isClickInside = true;
        }
      });

      if (!isClickInside) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen]);

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      {children}
    </PopoverContext.Provider>
  );
};

// 🎯 Popover Trigger
const PopoverTrigger = ({ asChild = false, children, onClick }) => {
  const context = useContext(PopoverContext);
  if (!context) throw new Error("PopoverTrigger must be used within a Popover");

  const { open, setOpen } = context;

  const handleClick = (e) => {
    setOpen(!open);
    if (onClick) onClick(e);
  };

  if (asChild) {
    return (
      <>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              ...child.props,
              onClick: (e) => {
                handleClick(e);
                if (child.props.onClick) child.props.onClick(e);
              },
            });
          }
          return child;
        })}
      </>
    );
  }

  return (
    <button type="button" onClick={handleClick} aria-expanded={open}>
      {children}
    </button>
  );
};

// 💬 Popover Content
const PopoverContent = React.forwardRef(
  ({ className, align = "center", sideOffset = 4, children, ...props }, ref) => {
    const context = useContext(PopoverContext);
    if (!context) throw new Error("PopoverContent must be used within a Popover");

    const { open, setOpen } = context;

    if (!open) return null;

    return (
      <>
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity" />
        <div
          ref={ref}
          data-popover-content
          className={cn(
            "fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-auto max-w-[90vw] rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
            className
          )}
          {...props}
        >
          {/* ❌ Close Icon */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-900 dark:hover:text-white"
          >
            <BadgeX className="w-5 h-5" />
          </button>
          {children}
        </div>
      </>
    );
  }
);
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };
