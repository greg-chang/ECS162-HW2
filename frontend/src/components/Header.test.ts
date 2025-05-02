import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import Header from './Header.svelte';

describe('Header', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 0, 1)); // January 1, 2024
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders header elements', () => {
    render(Header, { props: { apiKey: 'test-key' } });
    
    // Check date elements
    expect(screen.getByText(/Monday/)).toBeTruthy();
    expect(screen.getByText(/January/)).toBeTruthy();
    expect(screen.getByText(/2024/)).toBeTruthy();
    
    // Check other elements
    expect(screen.getByText("Today's Paper")).toBeTruthy();
    expect(screen.getByAltText("New York Times Logo")).toBeTruthy();
  });
});