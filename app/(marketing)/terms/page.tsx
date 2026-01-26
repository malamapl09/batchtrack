/**
 * Terms of Service Page
 * Comprehensive terms of service for BatchTrack
 * Covers SLA, acceptable use, DMCA, dispute resolution, and more
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
          <h1>Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: {lastUpdated}<br />
            Effective date: {effectiveDate}
          </p>

          <p>
            <strong>PLEASE READ THESE TERMS CAREFULLY.</strong> By accessing or using BatchTrack,
            you agree to be bound by these Terms of Service. If you do not agree, do not use
            the Service.
          </p>

          <h2>1. Definitions</h2>
          <ul>
            <li><strong>&quot;Service&quot;</strong> means the BatchTrack web application and related services.</li>
            <li><strong>&quot;User,&quot; &quot;you,&quot; &quot;your&quot;</strong> means any individual or entity using the Service.</li>
            <li><strong>&quot;We,&quot; &quot;us,&quot; &quot;our&quot;</strong> means BatchTrack and its operators.</li>
            <li><strong>&quot;Content&quot;</strong> means any data, text, or materials uploaded to or created within the Service.</li>
            <li><strong>&quot;Subscription&quot;</strong> means a paid plan granting access to the Service.</li>
          </ul>

          <h2>2. Acceptance of Terms</h2>
          <p>
            By creating an account or using the Service, you represent that you are at least 18
            years old and have the legal authority to enter into this agreement. If you are
            using the Service on behalf of an organization, you represent that you have
            authority to bind that organization to these Terms.
          </p>

          <h2>3. Description of Service</h2>
          <p>
            BatchTrack is a cloud-based inventory management and cost tracking platform for
            bakeries, breweries, and food production businesses. The Service enables users to:
          </p>
          <ul>
            <li>Track ingredients and raw materials inventory</li>
            <li>Create and cost recipes</li>
            <li>Manage batch production</li>
            <li>Monitor costs and generate reports</li>
          </ul>

          <h2>4. Account Registration and Security</h2>
          <h3>4.1 Account Creation</h3>
          <ul>
            <li>You must provide accurate, current, and complete registration information.</li>
            <li>You must maintain and promptly update your account information.</li>
            <li>One person or entity may not maintain more than one free account.</li>
          </ul>

          <h3>4.2 Account Security</h3>
          <ul>
            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
            <li>You must immediately notify us of any unauthorized access to your account.</li>
            <li>You are responsible for all activities that occur under your account.</li>
            <li>We are not liable for any loss or damage arising from your failure to protect your credentials.</li>
          </ul>

          <h2>5. Subscription and Payment</h2>
          <h3>5.1 Plans and Pricing</h3>
          <ul>
            <li>The Service is offered under various subscription plans as described on our pricing page.</li>
            <li>Prices are subject to change with 30 days&apos; prior notice.</li>
            <li>All prices are exclusive of applicable taxes unless stated otherwise.</li>
          </ul>

          <h3>5.2 Billing</h3>
          <ul>
            <li>Subscriptions are billed in advance on a monthly or annual basis.</li>
            <li>Payment is due upon subscription and on each renewal date.</li>
            <li>Failed payments may result in suspension of access to the Service.</li>
          </ul>

          <h3>5.3 Free Trial</h3>
          <ul>
            <li>We may offer a free trial period at our discretion.</li>
            <li>At the end of the trial, you must subscribe to continue using paid features.</li>
            <li>We reserve the right to limit or terminate trial access at any time.</li>
          </ul>

          <h3>5.4 Refunds</h3>
          <ul>
            <li>Subscription fees are generally non-refundable.</li>
            <li>Refund requests for annual subscriptions may be considered within 14 days of purchase.</li>
            <li>Pro-rated refunds are not provided for partial-month usage.</li>
          </ul>

          <h3>5.5 Cancellation</h3>
          <ul>
            <li>You may cancel your subscription at any time through your account settings.</li>
            <li>Cancellation takes effect at the end of the current billing period.</li>
            <li>You retain access to paid features until the end of your paid period.</li>
          </ul>

          <h2>6. Acceptable Use Policy</h2>
          <p>You agree NOT to use the Service to:</p>
          <ul>
            <li>Violate any applicable laws, regulations, or third-party rights</li>
            <li>Upload or transmit viruses, malware, or other malicious code</li>
            <li>Attempt to gain unauthorized access to the Service or other users&apos; accounts</li>
            <li>Interfere with or disrupt the Service or its infrastructure</li>
            <li>Scrape, crawl, or use automated means to access the Service without permission</li>
            <li>Reverse engineer, decompile, or attempt to extract source code</li>
            <li>Use the Service to send spam or unsolicited communications</li>
            <li>Impersonate another person or entity</li>
            <li>Upload content that is illegal, defamatory, obscene, or infringes intellectual property rights</li>
            <li>Resell or redistribute the Service without authorization</li>
            <li>Use the Service for any purpose other than its intended use</li>
          </ul>
          <p>
            Violation of this Acceptable Use Policy may result in immediate termination of
            your account without refund.
          </p>

          <h2>7. Intellectual Property</h2>
          <h3>7.1 Our Intellectual Property</h3>
          <p>
            The Service, including its software, design, logos, and documentation, is owned
            by BatchTrack and protected by copyright, trademark, and other intellectual property
            laws. You may not copy, modify, distribute, or create derivative works without
            our express written permission.
          </p>

          <h3>7.2 Your Content</h3>
          <p>
            You retain all ownership rights to Content you upload to the Service. By uploading
            Content, you grant us a limited, non-exclusive, royalty-free license to store,
            process, and display your Content solely to provide the Service to you.
          </p>

          <h3>7.3 Feedback</h3>
          <p>
            If you provide suggestions, ideas, or feedback about the Service, you grant us
            a perpetual, irrevocable, royalty-free license to use and incorporate such
            feedback without compensation or attribution.
          </p>

          <h2>8. Service Level Agreement (SLA)</h2>
          <h3>8.1 Uptime Commitment</h3>
          <p>
            We target 99.9% monthly uptime for the Service, excluding scheduled maintenance
            and circumstances beyond our reasonable control.
          </p>

          <h3>8.2 Scheduled Maintenance</h3>
          <ul>
            <li>We will provide at least 24 hours&apos; notice for scheduled maintenance.</li>
            <li>Maintenance will be scheduled during low-usage periods when possible.</li>
            <li>Emergency maintenance may occur without prior notice.</li>
          </ul>

          <h3>8.3 Service Credits</h3>
          <p>
            If monthly uptime falls below 99.9% due to our failure (excluding scheduled
            maintenance and force majeure events), you may request a service credit:
          </p>
          <table>
            <thead>
              <tr>
                <th>Monthly Uptime</th>
                <th>Service Credit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>99.0% - 99.9%</td>
                <td>10% of monthly fee</td>
              </tr>
              <tr>
                <td>95.0% - 99.0%</td>
                <td>25% of monthly fee</td>
              </tr>
              <tr>
                <td>Below 95.0%</td>
                <td>50% of monthly fee</td>
              </tr>
            </tbody>
          </table>
          <p>
            Service credits must be requested within 30 days of the incident and are your
            sole remedy for downtime.
          </p>

          <h2>9. Data Processing</h2>
          <p>
            Our processing of your personal data is governed by our{' '}
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            For business customers requiring a Data Processing Agreement (DPA), please contact
            us at <a href="mailto:legal@batchtrack.com">legal@batchtrack.com</a>.
          </p>

          <h2>10. DMCA and Copyright Policy</h2>
          <h3>10.1 Reporting Infringement</h3>
          <p>
            If you believe Content on the Service infringes your copyright, please send a
            notice to our designated agent with:
          </p>
          <ul>
            <li>Identification of the copyrighted work claimed to be infringed</li>
            <li>Identification of the allegedly infringing material and its location</li>
            <li>Your contact information (name, address, phone, email)</li>
            <li>A statement that you have a good faith belief that the use is not authorized</li>
            <li>A statement under penalty of perjury that your notice is accurate</li>
            <li>Your physical or electronic signature</li>
          </ul>

          <h3>10.2 DMCA Agent</h3>
          <p>
            <strong>Email:</strong> <a href="mailto:dmca@batchtrack.com">dmca@batchtrack.com</a>
          </p>

          <h3>10.3 Counter-Notification</h3>
          <p>
            If you believe your Content was wrongly removed, you may submit a counter-notification
            with the information required under 17 U.S.C. § 512(g).
          </p>

          <h2>11. Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul>
            <li>MERCHANTABILITY</li>
            <li>FITNESS FOR A PARTICULAR PURPOSE</li>
            <li>NON-INFRINGEMENT</li>
            <li>ACCURACY OR COMPLETENESS OF CONTENT</li>
            <li>UNINTERRUPTED OR ERROR-FREE OPERATION</li>
          </ul>
          <p>
            WE DO NOT WARRANT THAT THE SERVICE WILL MEET YOUR REQUIREMENTS OR THAT DEFECTS
            WILL BE CORRECTED.
          </p>

          <h2>12. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW:
          </p>
          <ul>
            <li>
              WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
              OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, BUSINESS OPPORTUNITIES,
              OR GOODWILL.
            </li>
            <li>
              OUR TOTAL LIABILITY FOR ALL CLAIMS ARISING FROM OR RELATED TO THE SERVICE
              SHALL NOT EXCEED THE AMOUNT PAID BY YOU FOR THE SERVICE IN THE TWELVE (12)
              MONTHS PRECEDING THE CLAIM.
            </li>
            <li>
              THESE LIMITATIONS APPLY REGARDLESS OF THE THEORY OF LIABILITY AND EVEN IF WE
              HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </li>
          </ul>

          <h2>13. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless BatchTrack and its officers,
            directors, employees, and agents from any claims, damages, losses, liabilities,
            costs, and expenses (including reasonable attorneys&apos; fees) arising from:
          </p>
          <ul>
            <li>Your use of the Service</li>
            <li>Your violation of these Terms</li>
            <li>Your Content</li>
            <li>Your violation of any third-party rights</li>
          </ul>

          <h2>14. Dispute Resolution</h2>
          <h3>14.1 Informal Resolution</h3>
          <p>
            Before initiating formal proceedings, you agree to contact us at{' '}
            <a href="mailto:legal@batchtrack.com">legal@batchtrack.com</a> and attempt to
            resolve any dispute informally for at least 30 days.
          </p>

          <h3>14.2 Binding Arbitration</h3>
          <p>
            If informal resolution fails, any dispute shall be resolved by binding arbitration
            administered by the American Arbitration Association (AAA) under its Commercial
            Arbitration Rules. The arbitration shall be conducted in English, and the
            arbitrator&apos;s decision shall be final and binding.
          </p>

          <h3>14.3 Class Action Waiver</h3>
          <p>
            YOU AGREE THAT ANY DISPUTE RESOLUTION PROCEEDINGS WILL BE CONDUCTED ONLY ON AN
            INDIVIDUAL BASIS AND NOT IN A CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION.
          </p>

          <h3>14.4 Exceptions</h3>
          <p>
            Either party may seek injunctive relief in any court of competent jurisdiction
            to protect intellectual property rights or prevent irreparable harm.
          </p>

          <h2>15. Governing Law and Venue</h2>
          <p>
            These Terms shall be governed by the laws of the State of Delaware, United States,
            without regard to conflict of law principles. Any legal action not subject to
            arbitration shall be brought exclusively in the state or federal courts located
            in Delaware.
          </p>

          <h2>16. Force Majeure</h2>
          <p>
            We shall not be liable for any failure or delay in performance due to circumstances
            beyond our reasonable control, including but not limited to:
          </p>
          <ul>
            <li>Natural disasters, acts of God</li>
            <li>War, terrorism, civil unrest</li>
            <li>Government actions, embargoes</li>
            <li>Labor disputes, strikes</li>
            <li>Internet or telecommunications failures</li>
            <li>Third-party service provider outages</li>
            <li>Pandemics or public health emergencies</li>
          </ul>

          <h2>17. Export Compliance</h2>
          <p>
            You agree to comply with all applicable export control laws and regulations. You
            represent that you are not located in, under the control of, or a national or
            resident of any country subject to U.S. embargo, and that you are not on any
            U.S. government restricted party list.
          </p>

          <h2>18. Termination</h2>
          <h3>18.1 Termination by You</h3>
          <p>
            You may terminate your account at any time by canceling your subscription and
            deleting your account through the settings page.
          </p>

          <h3>18.2 Termination by Us</h3>
          <p>
            We may suspend or terminate your access immediately, without prior notice, if:
          </p>
          <ul>
            <li>You violate these Terms or Acceptable Use Policy</li>
            <li>Your payment fails and remains outstanding</li>
            <li>We are required to do so by law</li>
            <li>We discontinue the Service</li>
          </ul>

          <h3>18.3 Effect of Termination</h3>
          <ul>
            <li>Your right to access the Service terminates immediately.</li>
            <li>We may delete your Content after 30 days following termination.</li>
            <li>Provisions that by their nature should survive will remain in effect.</li>
          </ul>

          <h2>19. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable or invalid, that
            provision shall be limited or eliminated to the minimum extent necessary, and
            the remaining provisions shall remain in full force and effect.
          </p>

          <h2>20. Waiver</h2>
          <p>
            Our failure to enforce any right or provision of these Terms shall not constitute
            a waiver of such right or provision. Any waiver must be in writing and signed
            by us to be effective.
          </p>

          <h2>21. Entire Agreement</h2>
          <p>
            These Terms, together with the Privacy Policy and any other policies referenced
            herein, constitute the entire agreement between you and BatchTrack regarding the
            Service and supersede all prior agreements and understandings.
          </p>

          <h2>22. Assignment</h2>
          <p>
            You may not assign or transfer these Terms without our prior written consent.
            We may assign these Terms without restriction in connection with a merger,
            acquisition, or sale of assets.
          </p>

          <h2>23. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will provide notice
            of material changes by:
          </p>
          <ul>
            <li>Posting the updated Terms with a new effective date</li>
            <li>Sending email notification to your registered address</li>
            <li>Displaying a notice within the Service</li>
          </ul>
          <p>
            Continued use of the Service after the effective date constitutes acceptance
            of the updated Terms.
          </p>

          <h2>24. Contact Information</h2>
          <p>For questions about these Terms, contact us:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:legal@batchtrack.com">legal@batchtrack.com</a></li>
            <li><strong>DMCA Agent:</strong> <a href="mailto:dmca@batchtrack.com">dmca@batchtrack.com</a></li>
          </ul>
        </article>
      </main>

      <Footer />
    </div>
  );
}
