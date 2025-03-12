// src/components/SessionRefresher/SessionRefresher.tsx
'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { UserRole } from '@/lib/clientUserPermissions';

interface SessionRefresherProps {
    onRoleUpdate?: (newRole: UserRole) => void;
}

const SessionRefresher: React.FC<SessionRefresherProps> = ({ onRoleUpdate }) => {
    const { data: session, update } = useSession();
    const [isChecking, setIsChecking] = useState(false);
    const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'unchanged' | 'error'>('idle');

    const checkAccess = async () => {
        setIsChecking(true);
        setStatus('checking');

        try {
            // Call the API route to check for role updates
            const response = await fetch('/api/auth/refresh-session');

            if (!response.ok) {
                throw new Error('Failed to refresh session');
            }

            const data = await response.json();

            if (data.roleUpdated) {
                // Update the client-side session with next-auth's update() function
                await update();
                setStatus('success');

                if (onRoleUpdate && data.session?.user?.role) {
                    onRoleUpdate(data.session.user.role as UserRole);
                }
            } else {
                setStatus('unchanged');
            }
        } catch (error) {
            console.error('Error refreshing session:', error);
            setStatus('error');
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="mt-4">
            <button
                onClick={checkAccess}
                disabled={isChecking}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
                {isChecking ? (
                    <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Checking...
          </span>
                ) : (
                    'Check Access Status'
                )}
            </button>

            {status === 'success' && (
                <div className="mt-2 p-2 bg-green-900/30 border border-green-800 rounded text-green-200">
                    Your session has been updated with your new permissions!
                </div>
            )}

            {status === 'unchanged' && (
                <div className="mt-2 p-2 bg-yellow-900/30 border border-yellow-800 rounded text-yellow-200">
                    Your access status hasn&#39;t changed yet. Please try again later.
                </div>
            )}

            {status === 'error' && (
                <div className="mt-2 p-2 bg-red-900/30 border border-red-800 rounded text-red-200">
                    There was an error checking your access status. Please try again.
                </div>
            )}
        </div>
    );
};

export default SessionRefresher;