/**
 * Settings Page
 * Account and organization settings
 */

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Upload, CreditCard } from 'lucide-react';

export const metadata = {
  title: 'Settings | BatchTrack',
  description: 'Manage your account and organization settings',
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch organization separately
  let organization = null;
  if (profile?.organization_id) {
    const { data: orgData } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', profile.organization_id)
      .single();
    organization = orgData;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and organization
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email || ''} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              defaultValue={profile?.full_name || ''}
              placeholder="Your name"
            />
          </div>
          <Button disabled>Save Changes</Button>
          <p className="text-xs text-muted-foreground">
            Profile editing coming soon
          </p>
        </CardContent>
      </Card>

      {/* Organization Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
          <CardDescription>Your organization settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization Name</Label>
            <Input
              id="orgName"
              defaultValue={organization?.name || ''}
              placeholder="Organization name"
            />
          </div>
          <div className="space-y-2">
            <Label>Plan</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium capitalize">
                {organization?.plan || 'Free'}
              </span>
              {organization?.plan !== 'pro' && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/pricing">Upgrade</Link>
                </Button>
              )}
            </div>
          </div>
          <Button disabled>Save Changes</Button>
          <p className="text-xs text-muted-foreground">
            Organization editing coming soon
          </p>
        </CardContent>
      </Card>

      {/* Data Import */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Data Import
          </CardTitle>
          <CardDescription>
            Bulk import ingredients and recipes from CSV files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/settings/import">
              <Upload className="mr-2 h-4 w-4" />
              Import Data
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Billing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Billing
          </CardTitle>
          <CardDescription>
            Manage your subscription and billing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Current Plan:</span>
            <span className="font-medium capitalize">
              {organization?.plan || 'Free'}
            </span>
          </div>
          <Button asChild>
            <Link href="/settings/billing">
              <CreditCard className="mr-2 h-4 w-4" />
              Manage Billing
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" disabled>
            Delete Account
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Account deletion coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
