
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '@/styles/Portfolio.module.css';

interface PortfolioItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string[];
  projectUrl?: string;
  githubUrl?: string;
  technologiesUsed: string[];
}

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        const response = await axios.get('/api/portfolio');
        setPortfolioItems(response.data.data);
      } catch (err) {
        console.error('Failed to fetch portfolio items:', err);
        setError('Failed to load portfolio items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioItems();
  }, []);

  if (loading) {
    return <div className={styles.container}><p>Loading portfolio...</p></div>;
  }

  if (error) {
    return <div className={styles.container}><p className={styles.error}>{error}</p></div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tirmidi Mohamed's Portfolio</h1>
      {portfolioItems.length === 0 ? (
        <p>No portfolio items to display yet. Check back soon!</p>
      ) : (
        <div className={styles.grid}>
          {portfolioItems.map((item) => (
            <div key={item._id} className={styles.card}>
              <h2 className={styles.cardTitle}>{item.title}</h2>
              <p className={styles.cardDescription}>{item.description}</p>
              {item.imageUrl && item.imageUrl.length > 0 && (
                <div className={styles.imageContainer}>
                  {item.imageUrl.map((url, index) => (
                    <img key={index} src={url} alt={item.title} className={styles.cardImage} />
                  ))}
                </div>
              )}
              {item.technologiesUsed && item.technologiesUsed.length > 0 && (
                <p className={styles.cardTech}>
                  <strong>Technologies:</strong> {item.technologiesUsed.join(', ')}
                </p>
              )}
              <div className={styles.cardActions}>
                {item.projectUrl && (
                  <a href={item.projectUrl} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
                    View Project
                  </a>
                )}
                {item.githubUrl && (
                  <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
                    GitHub Repo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Portfolio;
