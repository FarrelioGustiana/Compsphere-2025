import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface VerificationReminderProps {
    className?: string;
}

const VerificationReminder: React.FC<VerificationReminderProps> = ({ className = '' }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`bg-blue-900/30 backdrop-blur-sm border border-blue-500/20 rounded-lg p-4 shadow-lg ${className}`}
        >
            <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500/20 p-2 rounded-full">
                    <Mail className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-4 flex-grow">
                    <h3 className="text-sm font-medium text-blue-100">Email verification required</h3>
                    <p className="text-xs text-blue-200/80 mt-1">
                        Please verify your email address to access all features.
                    </p>
                </div>
                <Link
                    href={route('verification.notice')}
                    className="ml-4 px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-100 text-xs rounded transition-colors duration-200"
                >
                    Verify now
                </Link>
            </div>
        </motion.div>
    );
};

export default VerificationReminder;
