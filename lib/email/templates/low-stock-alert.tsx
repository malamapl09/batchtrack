/**
 * Low Stock Alert Email Template
 * Sent when ingredients fall below their reorder threshold
 */

import { Heading, Link, Text, Button, Section, Row, Column } from '@react-email/components';
import * as React from 'react';
import { BaseEmail, emailStyles } from './base';

interface LowStockItem {
  name: string;
  currentStock: number;
  threshold: number;
  unit: string;
}

interface LowStockAlertEmailProps {
  userName?: string;
  items: LowStockItem[];
  dashboardUrl?: string;
}

/**
 * LowStockAlertEmail Component
 * Notifies users about ingredients that need reordering
 */
export function LowStockAlertEmail({
  userName = 'there',
  items = [],
  dashboardUrl = 'https://batchtrack.vercel.app/ingredients?filter=low-stock',
}: LowStockAlertEmailProps) {
  const itemCount = items.length;
  const previewText = `${itemCount} ingredient${itemCount !== 1 ? 's' : ''} running low - time to reorder`;

  return (
    <BaseEmail previewText={previewText}>
      <Heading style={emailStyles.heading}>Low Stock Alert</Heading>

      <Text style={emailStyles.paragraph}>Hi {userName},</Text>

      <Text style={emailStyles.paragraph}>
        The following ingredient{itemCount !== 1 ? 's have' : ' has'} fallen
        below your reorder threshold:
      </Text>

      {/* Alert box with items */}
      <Section style={emailStyles.alertBox}>
        {items.map((item, index) => (
          <Row key={index} style={itemRow}>
            <Column style={itemName}>
              <Text style={itemNameText}>{item.name}</Text>
            </Column>
            <Column style={itemStock}>
              <Text style={itemStockText}>
                <span style={currentStock}>{item.currentStock}</span>
                <span style={stockDivider}> / </span>
                <span style={thresholdStock}>{item.threshold}</span>
                <span style={unitText}> {item.unit}</span>
              </Text>
            </Column>
          </Row>
        ))}
      </Section>

      <Text style={emailStyles.mutedText}>
        Current stock / Reorder threshold
      </Text>

      <Section style={buttonContainer}>
        <Button href={dashboardUrl} style={emailStyles.button}>
          View Low Stock Items
        </Button>
      </Section>

      <Text style={emailStyles.paragraph}>
        You can adjust reorder thresholds in your ingredient settings to
        customize when you receive these alerts.
      </Text>

      <Text style={emailStyles.mutedText}>
        To stop receiving these emails, update your notification preferences in
        your{' '}
        <Link href="https://batchtrack.vercel.app/settings" style={settingsLink}>
          account settings
        </Link>
        .
      </Text>
    </BaseEmail>
  );
}

// Local styles
const itemRow = {
  marginBottom: '8px',
};

const itemName = {
  width: '60%',
};

const itemNameText = {
  color: '#292524',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
};

const itemStock = {
  width: '40%',
  textAlign: 'right' as const,
};

const itemStockText = {
  color: '#292524',
  fontSize: '14px',
  margin: '0',
};

const currentStock = {
  color: '#dc2626', // Red for low
  fontWeight: 'bold',
};

const stockDivider = {
  color: '#78716c',
};

const thresholdStock = {
  color: '#78716c',
};

const unitText = {
  color: '#78716c',
  fontSize: '12px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
};

const settingsLink = {
  color: '#f59e0b',
};

export default LowStockAlertEmail;
