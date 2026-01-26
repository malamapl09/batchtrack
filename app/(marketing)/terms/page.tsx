/**
 * Terms of Service Page
 * Standard SaaS terms of service for BatchTrack
 */

import Link from 'next/link';
import { Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/marketing/footer';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for BatchTrack - Please read these terms carefully before using our service.',
};

export default function TermsOfServicePage() {
  const lastUpdated = 'January 2025';

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">BatchTrack</span>
            </Link>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <article className="max-w-3xl mx-auto prose prose-stone dark:prose-invert">
          <h1>Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {lastUpdated}</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using BatchTrack (&quot;Service&quot;), you agree to be bound by these
            Terms of Service (&quot;Terms&quot;). If you disagree with any part of the terms, you
            may not access the Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            BatchTrack is a cloud-based inventory management and cost tracking platform
            designed for bakeries, breweries, and food production businesses. The Service
            allows users to track ingredients, manage recipes, and monitor production costs.
          </p>

          <h2>3. Account Registration</h2>
          <ul>
            <li>You must provide accurate and complete registration information.</li>
            <li>You are responsible for maintaining the security of your account credentials.</li>
            <li>You must notify us immediately of any unauthorized use of your account.</li>
            <li>You must be at least 18 years old to use this Service.</li>
          </ul>

          <h2>4. Subscription and Payment</h2>
          <h3>4.1 Free Trial</h3>
          <p>
            We may offer a free trial period. At the end of the trial, you will need to
            subscribe to continue using the Service.
          </p>

          <h3>4.2 Subscription Plans</h3>
          <ul>
            <li>Subscriptions are billed monthly or annually in advance.</li>
            <li>Prices are subject to change with 30 days notice.</li>
            <li>All fees are non-refundable unless otherwise stated.</li>
          </ul>

          <h3>4.3 Cancellation</h3>
          <p>
            You may cancel your subscription at any time. Cancellation takes effect at the
            end of the current billing period.
          </p>

          <h2>5. User Responsibilities</h2>
          <p>You agree to:</p>
          <ul>
            <li>Use the Service only for lawful purposes</li>
            <li>Not attempt to gain unauthorized access to any part of the Service</li>
            <li>Not interfere with or disrupt the Service or servers</li>
            <li>Not upload malicious code or content</li>
            <li>Maintain accurate business data within the Service</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>

          <h2>6. Intellectual Property</h2>
          <h3>6.1 Our Property</h3>
          <p>
            The Service, including its original content, features, and functionality, is
            owned by BatchTrack and protected by copyright, trademark, and other laws.
          </p>

          <h3>6.2 Your Content</h3>
          <p>
            You retain ownership of data you enter into the Service (ingredients, recipes,
            production records). You grant us a license to use this data solely to provide
            and improve the Service.
          </p>

          <h2>7. Data and Privacy</h2>
          <p>
            Your use of the Service is also governed by our{' '}
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>,
            which describes how we collect and use your information.
          </p>

          <h2>8. Service Availability</h2>
          <ul>
            <li>We strive to maintain high availability but do not guarantee uninterrupted service.</li>
            <li>We may perform scheduled maintenance with reasonable notice.</li>
            <li>We are not liable for any downtime or service interruptions.</li>
          </ul>

          <h2>9. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, BATCHTRACK SHALL NOT BE LIABLE FOR ANY
            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING
            LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES, ARISING FROM YOUR USE OF THE
            SERVICE.
          </p>
          <p>
            Our total liability for any claims arising from your use of the Service shall
            not exceed the amount paid by you for the Service in the twelve months preceding
            the claim.
          </p>

          <h2>10. Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY
            KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR
            PURPOSE, OR NON-INFRINGEMENT.
          </p>

          <h2>11. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless BatchTrack from any claims, damages,
            or expenses arising from your use of the Service or violation of these Terms.
          </p>

          <h2>12. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice, for
            conduct that we believe violates these Terms or is harmful to other users, us,
            or third parties.
          </p>

          <h2>13. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will provide notice
            of significant changes. Continued use of the Service after changes constitutes
            acceptance of the new Terms.
          </p>

          <h2>14. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with applicable
            laws, without regard to conflict of law principles.
          </p>

          <h2>15. Contact Information</h2>
          <p>
            For questions about these Terms, please contact us at:{' '}
            <a href="mailto:legal@batchtrack.com">legal@batchtrack.com</a>
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
