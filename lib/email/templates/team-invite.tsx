/**
 * Team Invite Email Template
 * Sent when a team member is invited to join an organization
 */

import { Heading, Link, Text, Button, Section } from '@react-email/components';
import * as React from 'react';
import { BaseEmail, emailStyles } from './base';

interface TeamInviteEmailProps {
  inviterName?: string;
  organizationName: string;
  role: string;
  inviteUrl: string;
}

export function TeamInviteEmail({
  inviterName = 'A team member',
  organizationName,
  role,
  inviteUrl = 'https://batchtrack.vercel.app/invite/token',
}: TeamInviteEmailProps) {
  return (
    <BaseEmail previewText={`You've been invited to join ${organizationName} on BatchTrack`}>
      <Heading style={emailStyles.heading}>You&apos;re Invited!</Heading>

      <Text style={emailStyles.paragraph}>
        {inviterName} has invited you to join <strong>{organizationName}</strong> on
        BatchTrack as a <strong>{role}</strong>.
      </Text>

      <Text style={emailStyles.paragraph}>
        BatchTrack helps teams track inventory, cost recipes, and manage production.
        Click below to accept the invitation and get started.
      </Text>

      <Section style={buttonContainer}>
        <Button href={inviteUrl} style={emailStyles.button}>
          Accept Invitation
        </Button>
      </Section>

      <Text style={emailStyles.mutedText}>
        This invitation expires in 7 days. If you didn&apos;t expect this invitation,
        you can safely ignore this email.
      </Text>
    </BaseEmail>
  );
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
};

export default TeamInviteEmail;
