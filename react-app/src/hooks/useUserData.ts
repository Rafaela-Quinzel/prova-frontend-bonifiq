import { useEffect, useState } from 'react';
import type { User, Post } from '../types';
import { fetchUserData } from '../services/api';
import { getUserIdFromParent } from '../utils/postMessage';

export function useUserData() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = await getUserIdFromParent();

      const { user: userData, posts: userPosts } =
        await fetchUserData(userId);

      setUser(userData);
      setPosts(userPosts);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to load user data';

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const retry = () => {
    loadUserData();
  };

  return {
    user,
    posts,
    loading,
    error,
    retry,
  };
}