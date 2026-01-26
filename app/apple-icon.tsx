/**
 * Apple Touch Icon Generator
 * Creates a larger icon for iOS home screen
 */

import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f59e0b',
          borderRadius: '32px',
        }}
      >
        {/* Package/Box icon - larger for apple touch */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" />
          <path d="M2 7l10 5 10-5" />
          <path d="M12 12v10" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
