import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import PostDetail from './pages/PostDetail.jsx';
import PostForm from './pages/PostForm.jsx';

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="brand">My Blog</Link>
        <div className="nav-links">
          {user ? (
            <>
              <span>Hi, {user.username}</span>
              <Link to="/new">Write Post</Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/new" element={<Protected><PostForm /></Protected>} />
          <Route path="/edit/:id" element={<Protected><PostForm /></Protected>} />
        </Routes>
      </main>

      <footer className="footer">Blogging Platform project by Chayan Choudhury</footer>
    </>
  );
}
