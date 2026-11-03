import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/posts')
      .then(setPosts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h1>All Posts</h1>
      {posts.length === 0 && <p>No posts yet. Be the first to write one!</p>}
      {posts.map((p) => (
        <div className="card" key={p.id}>
          <h2>
            <Link to={`/posts/${p.id}`}>{p.title}</Link>
          </h2>
          <p className="meta">
            by {p.author} on {new Date(p.created_at).toLocaleDateString()} · {p.comment_count}{' '}
            comments
          </p>
          <p>{p.excerpt}{p.excerpt.length >= 200 ? '...' : ''}</p>
        </div>
      ))}
    </div>
  );
}
