import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '@/styles/Account.module.css';

interface User {
  username: string;
  createdAt: string;
}

const Account = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [edit, setEdit] = useState(false);
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localUsername, setLocalUsername] = useState<string | null>(null); // New state for local username
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username'); // Get username from localStorage
    if (storedUsername) {
      setLocalUsername(storedUsername);
    }

    if (!token) {
      router.push('/auth');
      return;
    }

    axios.get('/api/account', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUser(res.data);
        setUsername(res.data.username);
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('username'); // Also remove username on error
        router.push('/auth');
      });
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!confirmPassword) {
      setError('Please enter your current password to confirm.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('/api/user/update', {
        username,
        password: newPassword ? newPassword : undefined,
        currentPassword: confirmPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Account updated successfully!');
      setEdit(false);
      setNewPassword('');
      setConfirmPassword('');
      setUser(res.data);
      setUsername(res.data.username); // Explicitly update username state
      localStorage.setItem('username', res.data.username); // Update username in localStorage
      setLocalUsername(res.data.username); // Update local state
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username'); // Remove username on logout
    router.push('/auth');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {localUsername && <h2>Welcome {localUsername} to Tirmidi's Portfolio!</h2>}
        <div className={styles.actions} style={{ justifyContent: 'center', marginBottom: '1rem' }}>
          <button onClick={() => router.push('/portfolio')}>Show Portfolio</button>
        </div>
        <h2>Account</h2>
        <div className={styles.info}>
          <div>Username: {user.username}</div>
          <div>Created At: {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}</div>
        </div>
        <div className={styles.actions}>
          <button onClick={() => setEdit(!edit)}>{edit ? 'Cancel' : 'Edit Account'}</button>
          <button onClick={() => router.push('/admin/add-portfolio')}>Add Portfolio Item</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
        {edit && (
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="New Username"
              required
            />
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="New Password (leave blank to keep current)"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Current Password (required)"
              required
            />
            <button type="submit">Update</button>
          </form>
        )}
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
      </div>
    </div>
  );
};

export default Account;