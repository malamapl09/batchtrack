/**
 * Paddle Provider Component
 * Initializes Paddle.js and provides checkout functionality
 */

'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { initializePaddle, type Paddle } from '@paddle/paddle-js';

interface PaddleContextType {
  paddle: Paddle | null;
  isLoaded: boolean;
  openCheckout: (priceId: string, options?: CheckoutOptions) => void;
}

interface CheckoutOptions {
  email?: string;
  customData?: Record<string, string>;
}

const PaddleContext = createContext<PaddleContextType>({
  paddle: null,
  isLoaded: false,
  openCheckout: () => {},
});

/**
 * Hook to access Paddle context
 */
export function usePaddle() {
  const context = useContext(PaddleContext);
  if (!context) {
    throw new Error('usePaddle must be used within a PaddleProvider');
  }
  return context;
}

interface PaddleProviderProps {
  children: React.ReactNode;
}

/**
 * PaddleProvider Component
 * Wraps app to provide Paddle checkout functionality
 */
export function PaddleProvider({ children }: PaddleProviderProps) {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

    if (!clientToken) {
      console.warn('Paddle client token not configured');
      return;
    }

    initializePaddle({
      token: clientToken,
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
      eventCallback: (event) => {
        // Handle Paddle events
        switch (event.name) {
          case 'checkout.completed':
            console.log('Checkout completed:', event.data);
            // Redirect to success page or refresh subscription status
            window.location.href = '/dashboard?subscription=success';
            break;
          case 'checkout.closed':
            console.log('Checkout closed');
            break;
          case 'checkout.error':
            console.error('Checkout error:', event.data);
            break;
        }
      },
    }).then((paddleInstance) => {
      if (paddleInstance) {
        setPaddle(paddleInstance);
        setIsLoaded(true);
      }
    });
  }, []);

  const openCheckout = useCallback(
    (priceId: string, options?: CheckoutOptions) => {
      if (!paddle) {
        console.error('Paddle not initialized');
        return;
      }

      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: options?.email ? { email: options.email } : undefined,
        customData: options?.customData,
        settings: {
          displayMode: 'overlay',
          theme: 'light',
          locale: 'en',
          allowLogout: true,
          showAddDiscounts: true,
        },
      });
    },
    [paddle]
  );

  return (
    <PaddleContext.Provider value={{ paddle, isLoaded, openCheckout }}>
      {children}
    </PaddleContext.Provider>
  );
}
