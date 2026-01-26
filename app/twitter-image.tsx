/**
 * Twitter Card Image Generator
 * Creates dynamic Twitter sharing preview images
 */

import { ImageResponse } from 'next/og';

export const alt = 'BatchTrack - Inventory Management for Production Businesses';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fafaf9',
          backgroundImage: 'linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%)',
        }}
      >
        {/* Amber accent bar at top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            backgroundColor: '#f59e0b',
          }}
        />

        {/* Logo and brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {/* Package icon */}
          <div
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#f59e0b',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="48"
              height="48"
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
          <span
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: '#292524',
            }}
          >
            BatchTrack
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: '32px',
            color: '#78716c',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.4,
          }}
        >
          Know Your True Cost of Goods
        </p>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '24px',
            color: '#a8a29e',
            marginTop: '16px',
          }}
        >
          Inventory management for bakeries, breweries & food producers
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
