
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Portfolio.module.css';

const Portfolio = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Congratulations!</h1>
        <h2>You have accessed Tirmidi Mohamed’s personal portfolio.</h2>
        <p>More content coming soon...</p>
        <div className={styles.actions}>
          <button onClick={() => router.push('/account')}>Account Settings</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
