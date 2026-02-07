'use client';

/**
 * Onboarding Form Component
 * Organization creation during signup flow
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { triggerWelcomeEmail } from '@/lib/actions/email';
import { slugify } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface OnboardingFormProps {
  userId: string;
  userEmail: string;
}

const BUSINESS_TYPES = [
  { value: 'bakery', label: 'Bakery' },
  { value: 'brewery', label: 'Brewery / Micro-brewery' },
  { value: 'restaurant', label: 'Restaurant / Kitchen' },
  { value: 'catering', label: 'Catering' },
  { value: 'food_production', label: 'Food Production' },
  { value: 'other', label: 'Other' },
] as const;

export function OnboardingForm({ userId, userEmail }: OnboardingFormProps) {
  const router = useRouter();

  const [organizationName, setOrganizationName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const supabase = createClient();

    // Generate a unique slug
    const baseSlug = slugify(organizationName);
    const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

    // Create organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: organizationName,
        slug: uniqueSlug,
        plan: 'free' as const,
      })
      .select()
      .single();

    if (orgError) {
      setError('Failed to create organization. Please try again.');
      setIsLoading(false);
      return;
    }

    // Create user profile linked to organization
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: userEmail,
        organization_id: org.id,
        role: 'owner',
      });

    if (userError) {
      // Cleanup: delete the organization we just created
      await supabase.from('organizations').delete().eq('id', org.id);
      setError('Failed to complete setup. Please try again.');
      setIsLoading(false);
      return;
    }

    // Fire and forget welcome email
    triggerWelcomeEmail(userEmail, organizationName);

    // Success - redirect to dashboard
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="organizationName">Organization name</Label>
        <Input
          id="organizationName"
          type="text"
          placeholder="Sunrise Bakery"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          required
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          This is the name of your business or production facility.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessType">Type of business</Label>
        <Select value={businessType} onValueChange={setBusinessType} disabled={isLoading}>
          <SelectTrigger id="businessType">
            <SelectValue placeholder="Select your business type" />
          </SelectTrigger>
          <SelectContent>
            {BUSINESS_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || !organizationName}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Get Started
      </Button>
    </form>
  );
}
