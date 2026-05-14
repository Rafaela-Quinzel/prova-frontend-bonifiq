import type { User, Post } from '../types';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Fetch user data by ID
 * @param userId - The user ID to fetch
 * @returns Promise with User data
 * @throws Error if the request fails
 */
export const fetchUser = async (userId: number): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: User = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error);
    throw error;
  }
};

/**
 * Fetch posts for a specific user
 * @param userId - The user ID to fetch posts for
 * @returns Promise with array of Posts
 * @throws Error if the request fails
 */
export const fetchPosts = async (userId: number): Promise<Post[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts?userId=${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Post[] = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch posts for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Fetch both user and posts data in parallel
 * @param userId - The user ID to fetch data for
 * @returns Promise with object containing user and posts
 */
export const fetchUserData = async (
  userId: number
): Promise<{ user: User; posts: Post[] }> => {
  try {
    const [user, posts] = await Promise.all([
      fetchUser(userId),
      fetchPosts(userId),
    ]);
    return { user, posts };
  } catch (error) {
    console.error(`Failed to fetch user data for ID ${userId}:`, error);
    throw error;
  }
};
