import '@testing-library/jest-dom';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchUser, fetchPosts } from '../../src/services/api';

// Mock fetch global
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('API Service', () => {
  afterEach(() => {
    mockFetch.mockReset();
  });

  it('fetchUser returns user data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: 'John Doe', email: 'john@example.com' }),
    });
    const user = await fetchUser(1);
    expect(user).toEqual({ id: 1, name: 'John Doe', email: 'john@example.com' });
    expect(mockFetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users/1');
  });

  it('fetchPosts returns posts array', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([{ id: 1, userId: 1, title: 'Post', body: 'Content' }]),
    });
    const posts = await fetchPosts(1);
    expect(posts).toEqual([{ id: 1, userId: 1, title: 'Post', body: 'Content' }]);
    expect(mockFetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts?userId=1');
  });

  it('fetchUser throws on error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });
    await expect(fetchUser(999)).rejects.toThrow();
  });
});
