/**
 * Privacy Policy Page
 * Standard SaaS privacy policy for BatchTrack
 */

import Link from 'next/link';
import { Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/marketing/footer';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for BatchTrack - Learn how we collect, use, and protect your data.',
};

export default function PrivacyPolicyPage() {
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
          <h1>Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {lastUpdated}</p>

          <h2>1. Introduction</h2>
          <p>
            BatchTrack (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your
            information when you use our inventory management service.
          </p>

          <h2>2. Information We Collect</h2>
          <h3>2.1 Information You Provide</h3>
          <ul>
            <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, and password.</li>
            <li><strong>Business Information:</strong> Information about your business including ingredients, recipes, production data, and inventory records.</li>
            <li><strong>Payment Information:</strong> When you subscribe, payment processing is handled by third-party processors who collect billing information.</li>
            <li><strong>Communications:</strong> Information you provide when contacting support or providing feedback.</li>
          </ul>

          <h3>2.2 Information Collected Automatically</h3>
          <ul>
            <li><strong>Usage Data:</strong> How you interact with our service, including features used and actions taken.</li>
            <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers.</li>
            <li><strong>Log Data:</strong> IP address, access times, and pages viewed.</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and manage your account</li>
            <li>Send service-related communications</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Monitor usage patterns and analyze trends</li>
            <li>Ensure security and prevent fraud</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>4. Information Sharing</h2>
          <p>We do not sell your personal information. We may share information with:</p>
          <ul>
            <li><strong>Service Providers:</strong> Third parties who help us operate our service (hosting, analytics, payment processing).</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights.</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</li>
          </ul>

          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your
            information against unauthorized access, alteration, disclosure, or destruction.
            However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2>6. Data Retention</h2>
          <p>
            We retain your information for as long as your account is active or as needed
            to provide services. You can request deletion of your data by contacting us.
          </p>

          <h2>7. Your Rights</h2>
          <p>Depending on your location, you may have rights to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing</li>
            <li>Data portability</li>
          </ul>

          <h2>8. Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to maintain your session, remember
            preferences, and analyze how our service is used. You can control cookies
            through your browser settings.
          </p>

          <h2>9. Third-Party Services</h2>
          <p>
            Our service may contain links to third-party websites or integrate with
            third-party services. We are not responsible for their privacy practices.
          </p>

          <h2>10. Children&apos;s Privacy</h2>
          <p>
            Our service is not intended for children under 13. We do not knowingly
            collect information from children under 13.
          </p>

          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of
            any changes by posting the new policy on this page and updating the
            &quot;Last updated&quot; date.
          </p>

          <h2>12. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at:{' '}
            <a href="mailto:privacy@batchtrack.com">privacy@batchtrack.com</a>
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
