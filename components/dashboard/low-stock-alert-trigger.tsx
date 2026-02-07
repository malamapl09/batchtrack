'use client';

/**
 * Low Stock Alert Trigger
 * Client component that checks and sends low stock email alerts
 * Uses localStorage for 24-hour deduplication
 */

import { useEffect } from 'react';
import { checkAndSendLowStockAlert } from '@/lib/actions/email';

const STORAGE_KEY = 'batchtrack:low-stock-alert-last-sent';
const DEDUP_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function LowStockAlertTrigger() {
  useEffect(() => {
    async function maybeAlert() {
      try {
        const lastSent = localStorage.getItem(STORAGE_KEY);
        if (lastSent) {
          const elapsed = Date.now() - parseInt(lastSent, 10);
          if (elapsed < DEDUP_INTERVAL_MS) {
            return;
          }
        }

        const sent = await checkAndSendLowStockAlert();
        if (sent) {
          localStorage.setItem(STORAGE_KEY, Date.now().toString());
        }
      } catch {
        // Silent failure - email alerts are not critical
      }
    }

    maybeAlert();
  }, []);

  return null;
}
