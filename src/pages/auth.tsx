
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '@/styles/Auth.module.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const validate = () => {
    if (username.length < 3) {
      setError('Username must be at least 3 characters.');
      return false;
    }
    if (password.length < 3) {
      setError('Password must be at least 3 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validate()) return;
    if (isLogin) {
      try {
        const res = await axios.post('/api/auth/login', { username, password });
        localStorage.setItem('token', res.data.token);
        setSuccess('Login successful!');
        setTimeout(() => {
          setSuccess('');
          router.push('/portfolio');
        }, 500);
      } catch (err) {
        setError(err.response?.data?.message || 'Login failed');
      }
    } else {
      try {
        await axios.post('/api/auth/register', { username, password });
        setSuccess('Registration successful! You can now log in.');
        setIsLogin(true);
        setUsername('');
        setPassword('');
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.toggle}>
          <button
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
            className={isLogin ? styles.active : ''}
          >
            Login
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
            className={!isLogin ? styles.active : ''}
          >
            Sign Up
          </button>
        </div>
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
      </div>
    </div>
  );
};

export default Auth;
