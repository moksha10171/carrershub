import { useEffect, useState, useCallback, useRef } from 'react';

interface AutoSaveOptions {
    interval?: number; // milliseconds
    onSave?: () => Promise<void>;
    enabled?: boolean;
}

interface AutoSaveReturn {
    lastSaved: Date | null;
    isSaving: boolean;
    saveNow: () => Promise<void>;
}

/**
 * Hook for auto-saving data at regular intervals
 * @param hasChanges - Whether there are unsaved changes
 * @param saveFn - Function to call for saving
 * @param options - Configuration options
 */
export function useAutoSave(
    hasChanges: boolean,
    saveFn: () => Promise<void>,
    options: AutoSaveOptions = {}
): AutoSaveReturn {
    const {
        interval = 30000, // Default: 30 seconds
        onSave,
        enabled = true
    } = options;

    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const saveInProgressRef = useRef(false);

    const saveNow = useCallback(async () => {
        if (saveInProgressRef.current) {
            return; // Already saving
        }

        try {
            saveInProgressRef.current = true;
            setIsSaving(true);

            await saveFn();

            setLastSaved(new Date());

            if (onSave) {
                await onSave();
            }
        } catch (error) {
            console.error('Auto-save failed:', error);
        } finally {
            setIsSaving(false);
            saveInProgressRef.current = false;
        }
    }, [saveFn, onSave]);

    useEffect(() => {
        if (!enabled || !hasChanges) {
            return;
        }

        const timer = setInterval(() => {
            if (hasChanges && !saveInProgressRef.current) {
                saveNow();
            }
        }, interval);

        return () => {
            clearInterval(timer);
        };
    }, [hasChanges, enabled, interval, saveNow]);

    return {
        lastSaved,
        isSaving,
        saveNow
    };
}
