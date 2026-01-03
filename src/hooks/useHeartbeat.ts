import { useEffect, useState, useCallback } from 'react';

interface ActiveEditor {
    user_id: string;
    user_email: string;
}

interface UseHeartbeatOptions {
    companyId: string | null;
    interval?: number; // milliseconds
    enabled?: boolean;
}

interface UseHeartbeatReturn {
    activeEditors: ActiveEditor[];
    isConnected: boolean;
}

/**
 * Hook for managing editor heartbeat and detecting concurrent editors
 * @param options - Configuration options
 */
export function useHeartbeat(options: UseHeartbeatOptions): UseHeartbeatReturn {
    const {
        companyId,
        interval = 30000, // Default: 30 seconds
        enabled = true
    } = options;

    const [activeEditors, setActiveEditors] = useState<ActiveEditor[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    const sendHeartbeat = useCallback(async () => {
        if (!companyId || !enabled) {
            return;
        }

        try {
            const response = await fetch('/api/companies/heartbeat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ company_id: companyId })
            });

            if (response.ok) {
                const data = await response.json();
                setActiveEditors(data.activeEditors || []);
                setIsConnected(true);
            } else {
                setIsConnected(false);
            }
        } catch (error) {
            console.error('Heartbeat failed:', error);
            setIsConnected(false);
        }
    }, [companyId, enabled]);

    const cleanup = useCallback(async () => {
        if (!companyId) {
            return;
        }

        try {
            await fetch(`/api/companies/heartbeat?company_id=${companyId}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Heartbeat cleanup failed:', error);
        }
    }, [companyId]);

    useEffect(() => {
        if (!enabled || !companyId) {
            return;
        }

        // Initial heartbeat
        sendHeartbeat();

        // Set up interval
        const timer = setInterval(sendHeartbeat, interval);

        // Cleanup on unmount
        return () => {
            clearInterval(timer);
            cleanup();
        };
    }, [companyId, enabled, interval, sendHeartbeat, cleanup]);

    return {
        activeEditors,
        isConnected
    };
}
