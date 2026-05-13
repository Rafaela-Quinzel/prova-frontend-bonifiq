import { Loading } from './components/ui/Loading/Loading';
import { ErrorMessage } from './components/ui/ErrorMessage/ErrorMessage';
import { UserInfo } from './components/user/UserInfo';
import { PostList } from './components/post/list/PostList';
import { useUserData } from './hooks/useUserData';
import './App.css';

function App() {
  const { user, posts, loading, error, retry } = useUserData();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={retry} />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="app-container">
      <UserInfo user={user} />

      <PostList posts={posts} />
    </div>
  );
}

export default App;