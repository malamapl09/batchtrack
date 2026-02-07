'use server';

/**
 * Email Server Actions
 * Trigger transactional emails from client components
 */

import { sendWelcomeEmail, sendLowStockAlert } from '@/lib/email/send';
import { createClient, getUserWithOrganization } from '@/lib/supabase/server';
import { getOrganizationPlan } from '@/lib/billing/check-limits';

/**
 * Trigger welcome email for a new user
 * Fire and forget - does not throw on failure
 */
export async function triggerWelcomeEmail(email: string, userName?: string) {
  try {
    await sendWelcomeEmail({ to: email, userName });
  } catch (error) {
    console.error('Failed to trigger welcome email:', error);
  }
}

/**
 * Check for low stock items and send alert email
 * Only sends for starter/pro plans
 * Returns whether an alert was sent
 */
export async function checkAndSendLowStockAlert(): Promise<boolean> {
  try {
    const planId = await getOrganizationPlan();

    // Only send alerts for paid plans
    if (planId === 'free') {
      return false;
    }

    const supabase = await createClient();
    const { user, organization } = await getUserWithOrganization();

    // Fetch low stock items
    const { data: lowStockItems, error } = await supabase
      .from('ingredients')
      .select('name, stock_quantity, low_stock_threshold, usage_unit')
      .eq('organization_id', organization.id)
      .not('low_stock_threshold', 'is', null)
      .filter('stock_quantity', 'lte', 'low_stock_threshold')
      .order('stock_quantity')
      .limit(10);

    if (error || !lowStockItems || lowStockItems.length === 0) {
      return false;
    }

    // Get user email
    const { data: userData } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('id', user.id)
      .single();

    if (!userData?.email) {
      return false;
    }

    const items = lowStockItems.map((item) => ({
      name: item.name,
      currentStock: item.stock_quantity,
      threshold: item.low_stock_threshold!,
      unit: item.usage_unit,
    }));

    await sendLowStockAlert({
      to: userData.email,
      userName: userData.full_name || undefined,
      items,
    });

    return true;
  } catch (error) {
    console.error('Failed to check/send low stock alert:', error);
    return false;
  }
}
