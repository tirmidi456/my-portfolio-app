
import Link from 'next/link';
import styles from '../styles/Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Tirmidi Mohamed</h1>
        <h2 className={styles.subtitle}>Personal Portfolio</h2>
        <p>Welcome! Please sign up or log in to access my portfolio.</p>
        <Link href="/auth" passHref>
          <button className={styles.button}>Sign Up / Log In</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
