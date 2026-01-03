'use client';

import { useEffect } from 'react';

interface AnalyticsTrackerProps {
    companyId: string;
    jobId?: string;
    pageType: 'careers' | 'job_detail';
}

export function AnalyticsTracker({ companyId, jobId, pageType }: AnalyticsTrackerProps) {
    useEffect(() => {
        const trackView = async () => {
            try {
                // Get or generate a visitor ID (simple version)
                let visitorId = localStorage.getItem('cv_visitor_id');
                if (!visitorId) {
                    visitorId = 'v_' + Math.random().toString(36).substring(2, 15);
                    localStorage.setItem('cv_visitor_id', visitorId);
                }

                await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        companyId,
                        jobId: jobId || null,
                        pageType,
                        referrer: document.referrer || 'Direct',
                        visitorId
                    })
                });
            } catch (err) {
                console.error('Failed to track page view:', err);
            }
        };

        trackView();
    }, [companyId, jobId, pageType]);

    return null;
}
