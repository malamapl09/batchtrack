/**
 * Privacy Policy Page
 * Comprehensive privacy policy for BatchTrack
 * Covers GDPR, CCPA, data processors, and international transfers
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
  const effectiveDate = 'January 26, 2025';

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
          <p className="text-muted-foreground">
            Last updated: {lastUpdated}<br />
            Effective date: {effectiveDate}
          </p>

          <h2>1. Introduction</h2>
          <p>
            BatchTrack (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your
            information when you use our inventory management service (the &quot;Service&quot;).
          </p>
          <p>
            By using the Service, you consent to the data practices described in this policy.
            If you do not agree with our policies and practices, please do not use the Service.
          </p>

          <h2>2. Information We Collect</h2>

          <h3>2.1 Information You Provide Directly</h3>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, password (hashed), and organization name when you register.</li>
            <li><strong>Business Data:</strong> Ingredients, recipes, production records, inventory data, supplier information, and cost data you enter into the Service.</li>
            <li><strong>Payment Information:</strong> When you subscribe, payment processing is handled by our third-party payment processor (Stripe). We do not store full credit card numbers.</li>
            <li><strong>Communications:</strong> Information you provide when contacting support, providing feedback, or responding to surveys.</li>
          </ul>

          <h3>2.2 Information Collected Automatically</h3>
          <ul>
            <li><strong>Usage Data:</strong> Features used, actions taken, pages viewed, and time spent on the Service.</li>
            <li><strong>Device Information:</strong> Browser type, operating system, device type, screen resolution, and unique device identifiers.</li>
            <li><strong>Log Data:</strong> IP address, access times, referring URLs, and error logs.</li>
            <li><strong>Analytics Data:</strong> Aggregated data about Service usage collected via Google Analytics.</li>
          </ul>

          <h3>2.3 Cookies and Tracking Technologies</h3>
          <p>We use the following cookies and tracking technologies:</p>
          <table>
            <thead>
              <tr>
                <th>Cookie/Technology</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Session Cookies</td>
                <td>Authentication and session management</td>
                <td>Session</td>
              </tr>
              <tr>
                <td>Supabase Auth</td>
                <td>User authentication tokens</td>
                <td>7 days</td>
              </tr>
              <tr>
                <td>Google Analytics (_ga, _gid)</td>
                <td>Usage analytics and performance</td>
                <td>2 years / 24 hours</td>
              </tr>
              <tr>
                <td>Sentry</td>
                <td>Error tracking and performance monitoring</td>
                <td>Session</td>
              </tr>
            </tbody>
          </table>
          <p>
            You can control cookies through your browser settings. Disabling cookies may affect
            Service functionality.
          </p>

          <h2>3. How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul>
            <li><strong>Provide the Service:</strong> Operate, maintain, and deliver the features you request.</li>
            <li><strong>Process Transactions:</strong> Manage your subscription and billing.</li>
            <li><strong>Send Communications:</strong> Service-related emails (welcome, alerts, updates) and, with your consent, marketing communications.</li>
            <li><strong>Improve the Service:</strong> Analyze usage patterns, fix bugs, and develop new features.</li>
            <li><strong>Ensure Security:</strong> Detect and prevent fraud, abuse, and security incidents.</li>
            <li><strong>Legal Compliance:</strong> Comply with applicable laws and legal processes.</li>
          </ul>

          <h3>3.1 Legal Basis for Processing (GDPR)</h3>
          <p>Under GDPR, we process your data based on:</p>
          <ul>
            <li><strong>Contract Performance:</strong> Processing necessary to provide the Service you requested.</li>
            <li><strong>Legitimate Interests:</strong> Improving the Service, security, and fraud prevention.</li>
            <li><strong>Consent:</strong> Marketing communications and optional analytics.</li>
            <li><strong>Legal Obligation:</strong> Compliance with applicable laws.</li>
          </ul>

          <h2>4. Data Sharing and Third-Party Processors</h2>
          <p>
            We do not sell your personal information. We share data with the following
            categories of third-party processors:
          </p>
          <table>
            <thead>
              <tr>
                <th>Processor</th>
                <th>Purpose</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Supabase</td>
                <td>Database hosting, authentication</td>
                <td>United States</td>
              </tr>
              <tr>
                <td>Vercel</td>
                <td>Application hosting, CDN</td>
                <td>Global (Edge)</td>
              </tr>
              <tr>
                <td>Google Analytics</td>
                <td>Usage analytics</td>
                <td>United States</td>
              </tr>
              <tr>
                <td>Sentry</td>
                <td>Error monitoring</td>
                <td>United States</td>
              </tr>
              <tr>
                <td>Resend</td>
                <td>Transactional emails</td>
                <td>United States</td>
              </tr>
              <tr>
                <td>Stripe</td>
                <td>Payment processing</td>
                <td>United States</td>
              </tr>
            </tbody>
          </table>
          <p>
            All processors are bound by data processing agreements and are required to protect
            your data in accordance with this policy and applicable law.
          </p>

          <h2>5. International Data Transfers</h2>
          <p>
            Your data may be transferred to and processed in the United States and other
            countries where our service providers operate. These countries may have different
            data protection laws than your country of residence.
          </p>
          <p>
            For transfers from the European Economic Area (EEA), United Kingdom, or Switzerland,
            we rely on:
          </p>
          <ul>
            <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
            <li>Adequacy decisions where applicable</li>
            <li>Binding Corporate Rules of our service providers</li>
          </ul>

          <h2>6. Data Retention</h2>
          <p>We retain your data according to the following schedule:</p>
          <table>
            <thead>
              <tr>
                <th>Data Type</th>
                <th>Retention Period</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Account Information</td>
                <td>Duration of account + 30 days after deletion</td>
              </tr>
              <tr>
                <td>Business Data (ingredients, recipes, etc.)</td>
                <td>Duration of account + 30 days after deletion</td>
              </tr>
              <tr>
                <td>Usage Logs</td>
                <td>90 days</td>
              </tr>
              <tr>
                <td>Analytics Data</td>
                <td>26 months (Google Analytics default)</td>
              </tr>
              <tr>
                <td>Payment Records</td>
                <td>7 years (legal requirement)</td>
              </tr>
              <tr>
                <td>Support Communications</td>
                <td>3 years after resolution</td>
              </tr>
            </tbody>
          </table>
          <p>
            You may request earlier deletion of your data subject to legal retention requirements.
          </p>

          <h2>7. Your Rights</h2>

          <h3>7.1 Rights for All Users</h3>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal data.</li>
            <li><strong>Correction:</strong> Request correction of inaccurate data.</li>
            <li><strong>Deletion:</strong> Request deletion of your data.</li>
            <li><strong>Export:</strong> Request your data in a portable format.</li>
          </ul>

          <h3>7.2 Additional Rights for EEA/UK Residents (GDPR)</h3>
          <ul>
            <li><strong>Restriction:</strong> Request restriction of processing.</li>
            <li><strong>Objection:</strong> Object to processing based on legitimate interests.</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent at any time where processing is based on consent.</li>
            <li><strong>Lodge Complaint:</strong> File a complaint with your local data protection authority.</li>
          </ul>

          <h3>7.3 California Residents (CCPA/CPRA)</h3>
          <p>California residents have additional rights under the CCPA/CPRA:</p>
          <ul>
            <li><strong>Right to Know:</strong> Request disclosure of personal information collected, sources, purposes, and third parties we share with.</li>
            <li><strong>Right to Delete:</strong> Request deletion of personal information.</li>
            <li><strong>Right to Opt-Out:</strong> Opt out of &quot;sale&quot; or &quot;sharing&quot; of personal information. <em>Note: We do not sell personal information.</em></li>
            <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your rights.</li>
            <li><strong>Right to Correct:</strong> Request correction of inaccurate personal information.</li>
            <li><strong>Right to Limit:</strong> Limit use of sensitive personal information.</li>
          </ul>
          <p>
            To exercise your CCPA rights, contact us at{' '}
            <a href="mailto:privacy@batchtrack.com">privacy@batchtrack.com</a> or use the
            request form in your account settings.
          </p>

          <h2>8. Data Security</h2>
          <p>We implement industry-standard security measures including:</p>
          <ul>
            <li>Encryption in transit (TLS 1.3) and at rest (AES-256)</li>
            <li>Secure password hashing (bcrypt)</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Access controls and authentication requirements</li>
            <li>Employee security training</li>
          </ul>
          <p>
            No method of transmission over the Internet is 100% secure. While we strive to
            protect your data, we cannot guarantee absolute security.
          </p>

          <h2>9. Data Breach Notification</h2>
          <p>
            In the event of a data breach that affects your personal information, we will:
          </p>
          <ul>
            <li>Notify affected users within 72 hours of becoming aware of the breach (as required by GDPR)</li>
            <li>Notify relevant supervisory authorities as required by law</li>
            <li>Provide information about the nature of the breach, likely consequences, and measures taken</li>
            <li>Offer guidance on steps you can take to protect yourself</li>
          </ul>

          <h2>10. Children&apos;s Privacy</h2>
          <p>
            The Service is not intended for children under 16. We do not knowingly collect
            personal information from children under 16. If we learn we have collected such
            information, we will promptly delete it.
          </p>

          <h2>11. Third-Party Links</h2>
          <p>
            The Service may contain links to third-party websites or services. We are not
            responsible for their privacy practices. We encourage you to review their
            privacy policies.
          </p>

          <h2>12. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of
            material changes by:
          </p>
          <ul>
            <li>Posting the new policy on this page with an updated date</li>
            <li>Sending an email notification for significant changes</li>
            <li>Displaying a notice within the Service</li>
          </ul>
          <p>
            Continued use of the Service after changes constitutes acceptance of the
            updated policy.
          </p>

          <h2>13. Contact Us</h2>
          <p>For privacy-related inquiries or to exercise your rights, contact us:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:privacy@batchtrack.com">privacy@batchtrack.com</a></li>
            <li><strong>Data Protection Officer:</strong> <a href="mailto:dpo@batchtrack.com">dpo@batchtrack.com</a></li>
          </ul>
          <p>
            We will respond to your request within 30 days (or sooner if required by law).
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
