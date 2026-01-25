/**
 * Utility Functions
 * Central export for all utilities including shadcn's cn function
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// shadcn utility for class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export all utilities from utils folder
export * from './utils/conversions';

/**
 * Generate a batch number in format YYYYMMDD-XXX
 */
export function generateBatchNumber(date: Date = new Date()): string {
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `${dateStr}-${random}`;
}

/**
 * Generate a URL-safe slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Pluralize a word based on count
 */
export function pluralize(word: string, count: number, plural?: string): string {
  if (count === 1) return word;
  return plural || `${word}s`;
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
