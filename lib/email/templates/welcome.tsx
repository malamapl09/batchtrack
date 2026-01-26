/**
 * Welcome Email Template
 * Sent when a new user signs up for BatchTrack
 */

import { Heading, Link, Text, Button, Section } from '@react-email/components';
import * as React from 'react';
import { BaseEmail, emailStyles } from './base';

interface WelcomeEmailProps {
  userName?: string;
  dashboardUrl?: string;
}

/**
 * WelcomeEmail Component
 * Welcomes new users and provides onboarding guidance
 */
export function WelcomeEmail({
  userName = 'there',
  dashboardUrl = 'https://batchtrack.vercel.app/dashboard',
}: WelcomeEmailProps) {
  return (
    <BaseEmail previewText="Welcome to BatchTrack - Let's get your inventory tracking started!">
      <Heading style={emailStyles.heading}>Welcome to BatchTrack!</Heading>

      <Text style={emailStyles.paragraph}>Hi {userName},</Text>

      <Text style={emailStyles.paragraph}>
        Thanks for signing up! BatchTrack helps you track inventory, cost
        recipes, and understand your true production costs.
      </Text>

      <Text style={emailStyles.paragraph}>
        Here&apos;s how to get started:
      </Text>

      <Section style={stepsList}>
        <Text style={stepItem}>
          <strong>1. Add your ingredients</strong> - Enter your raw materials
          with costs and units
        </Text>
        <Text style={stepItem}>
          <strong>2. Create recipes</strong> - Build recipes and see real-time
          cost calculations
        </Text>
        <Text style={stepItem}>
          <strong>3. Track production</strong> - Start batches and watch your
          inventory update automatically
        </Text>
      </Section>

      <Section style={buttonContainer}>
        <Button href={dashboardUrl} style={emailStyles.button}>
          Go to Dashboard
        </Button>
      </Section>

      <Text style={emailStyles.paragraph}>
        If you have any questions, just reply to this email. We&apos;re here to
        help!
      </Text>

      <Text style={emailStyles.paragraph}>
        Happy tracking,
        <br />
        The BatchTrack Team
      </Text>
    </BaseEmail>
  );
}

// Local styles
const stepsList = {
  margin: '16px 0',
  padding: '0 16px',
};

const stepItem = {
  color: '#292524',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 8px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
};

export default WelcomeEmail;
