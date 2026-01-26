/**
 * Base Email Template
 * Shared layout for all transactional emails
 * Uses BatchTrack branding with amber accent color
 */

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface BaseEmailProps {
  previewText: string;
  children: React.ReactNode;
}

// Brand colors
const colors = {
  primary: '#f59e0b', // Amber
  background: '#fafaf9',
  text: '#292524',
  muted: '#78716c',
  border: '#e7e5e4',
};

/**
 * BaseEmail Component
 * Wraps email content with consistent branding and layout
 */
export function BaseEmail({ previewText, children }: BaseEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>BatchTrack</Heading>
          </Section>

          {/* Content */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              BatchTrack - Inventory Management for Production Businesses
            </Text>
            <Text style={footerLinks}>
              <Link href="https://batchtrack.vercel.app" style={link}>
                Website
              </Link>
              {' | '}
              <Link href="https://batchtrack.vercel.app/privacy" style={link}>
                Privacy Policy
              </Link>
              {' | '}
              <Link href="https://batchtrack.vercel.app/terms" style={link}>
                Terms of Service
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: colors.background,
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const header = {
  padding: '24px',
  borderBottom: `3px solid ${colors.primary}`,
};

const logo = {
  color: colors.text,
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
};

const content = {
  padding: '24px',
};

const hr = {
  borderColor: colors.border,
  margin: '24px 0',
};

const footer = {
  padding: '0 24px',
};

const footerText = {
  color: colors.muted,
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '0 0 8px',
};

const footerLinks = {
  color: colors.muted,
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '0',
};

const link = {
  color: colors.primary,
  textDecoration: 'underline',
};

// Export reusable styles for child templates
export const emailStyles = {
  heading: {
    color: colors.text,
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '0 0 16px',
  },
  paragraph: {
    color: colors.text,
    fontSize: '14px',
    lineHeight: '24px',
    margin: '0 0 16px',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: '6px',
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '12px 24px',
    textDecoration: 'none',
    textAlign: 'center' as const,
  },
  mutedText: {
    color: colors.muted,
    fontSize: '12px',
    lineHeight: '20px',
    margin: '16px 0 0',
  },
  alertBox: {
    backgroundColor: '#fef3c7',
    border: `1px solid ${colors.primary}`,
    borderRadius: '6px',
    padding: '16px',
    margin: '16px 0',
  },
};
