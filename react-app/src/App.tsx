import { useEffect, useState } from 'react';
import type { User, Post } from './types';
import { fetchUserData } from './services/api';
import { getUserIdFromParent } from './utils/postMessage';
import { Loading } from './components/Loading';
import { ErrorMessage } from './components/ErrorMessage';
import { UserInfo } from './components/UserInfo';
import { PostCard } from './components/PostCard';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user ID from parent window via postMessage
        const userId = await getUserIdFromParent();

        // Fetch user and posts data
        const { user: userData, posts: userPosts } = await fetchUserData(userId);

        setUser(userData);
        setPosts(userPosts);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load user data';
        setError(errorMessage);
        console.error('Error loading user data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Reload the page to retry
    window.location.reload();
  };

  return (
    <div className="app-container">
      {loading && <Loading />}

      {error && !loading && (
        <ErrorMessage message={error} onRetry={handleRetry} />
      )}

      {!loading && !error && user && (
        <>
          <UserInfo user={user} />

          <div className="posts-section">
            <h2 className="posts-title">Posts ({posts.length})</h2>

            {posts.length === 0 ? (
              <div className="no-posts">No posts found</div>
            ) : (
              <div className="posts-list">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
