/**
 * Dynamic Favicon Generator
 * Creates a favicon using the ImageResponse API
 * This serves as both favicon.ico and apple-touch-icon
 */

import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
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
          borderRadius: '6px',
        }}
      >
        {/* Package/Box icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
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
