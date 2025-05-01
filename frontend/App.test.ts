import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import App from './App.svelte';

describe('App', () => {
  beforeEach(() => {
    // Mock fetch for API key
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url === '/api/key') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ apiKey: 'test-api-key' })
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  it('displays the API key from backend', async () => {
    render(App);
    
    // Wait for the API key to be displayed
    const apiKeyElement = await screen.findByText(/API Key: test-api-key/);
    expect(apiKeyElement).toBeTruthy();
  });

  it('handles API key fetch error', async () => {
    // Mock fetch to simulate an error
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.reject(new Error('Failed to fetch'));
    });

    render(App);
    
    // Wait for a bit to allow error handling
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Check that the API key is not displayed
    const apiKeyElement = screen.queryByText(/API Key:/);
    expect(apiKeyElement).toBeNull();
  });
});
