import { useState } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = ({
    title = 'Notification',
    description = '',
    variant = 'default',
    duration = 5000
  }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, description, variant, duration }]);
    
    // Auto-dismiss after duration
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter(toast => toast.id !== id));
  };

  return { toasts, addToast, dismissToast };
}
