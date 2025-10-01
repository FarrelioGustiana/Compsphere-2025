import React, { useEffect, useState } from 'react';
import { X, Info } from 'lucide-react';

interface OneTimeNotificationProps {
    storageKey: string;
    title?: string;
    message: string;
    duration?: number;
}

const OneTimeNotification: React.FC<OneTimeNotificationProps> = ({
    storageKey,
    title,
    message,
    duration = 3000
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Check if notification has been shown before
        try {
            const hasBeenShown = localStorage.getItem(storageKey) === 'true';
            if (!hasBeenShown) {
                // Small delay to ensure the page is loaded
                setTimeout(() => {
                    setIsVisible(true);
                    setIsAnimating(true);
                }, 500);
            }
        } catch (error) {
            // If localStorage is not available, show notification anyway
            setTimeout(() => {
                setIsVisible(true);
                setIsAnimating(true);
            }, 500);
        }
    }, [storageKey]);

    useEffect(() => {
        if (isVisible && isAnimating) {
            // Auto close timer
            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, isAnimating, duration]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setIsVisible(false);
            // Mark as shown in localStorage
            try {
                localStorage.setItem(storageKey, 'true');
            } catch (error) {
                console.warn('Failed to save notification state');
            }
        }, 300);
    };

    if (!isVisible) return null;

    return (
        <div
            className={`fixed bottom-4 left-4 z-50 transform transition-all duration-300 ease-in-out ${
                isAnimating
                    ? 'translate-x-0 opacity-100 scale-100'
                    : '-translate-x-full opacity-0 scale-95'
            }`}
            style={{ maxWidth: '600px', minWidth: '300px' }}
        >
            <div className="border-blue-500/20 bg-blue-950/80 backdrop-blur-lg border rounded-lg shadow-xl p-4 relative overflow-hidden">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50"></div>
                
                <div className="relative flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                        <Info className="w-5 h-5 text-blue-400" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {title && (
                            <h4 className="text-sm font-semibold text-white mb-1">
                                {title}
                            </h4>
                        )}
                        <div className="text-sm text-gray-200 leading-relaxed">
                            {message.split('<br />').map((line, index) => (
                                <div key={index} className={index > 0 ? 'mt-1' : ''}>
                                    {line}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="flex-shrink-0 text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded hover:bg-white/10"
                        aria-label="Close notification"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/50">
                    <div
                        className="h-full bg-blue-400 transition-all ease-linear"
                        style={{
                            width: isAnimating ? '0%' : '100%',
                            transition: `width ${duration}ms linear`
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default OneTimeNotification;
