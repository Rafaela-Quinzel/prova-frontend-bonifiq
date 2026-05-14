import type { Post } from '../../../types';
import { PostCard } from '../card/PostCard';
import './PostList.css';

interface Props {
  posts: Post[];
}

export function PostList({ posts }: Props) {
  return (
    <div className="posts-section">
      <h2 className="posts-title">
        Posts ({posts.length})
      </h2>

      {posts.length === 0 ? (
        <div className="no-posts">
          Nenhum post encontrado para este usuário.
        </div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))}
        </div>
      )}
    </div>
  );
}