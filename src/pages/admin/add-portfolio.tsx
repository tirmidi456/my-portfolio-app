
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '@/styles/Portfolio.module.css'; // Reusing portfolio styles for now

const AddPortfolio = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    projectUrl: '',
    githubUrl: '',
    technologiesUsed: '',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You are not authenticated.');
      router.push('/auth');
      return;
    }

    try {
      const payload = {
        ...formData,
        imageUrl: formData.imageUrl.split(',').map(url => url.trim()).filter(url => url !== ''),
        technologiesUsed: formData.technologiesUsed.split(',').map(tech => tech.trim()).filter(tech => tech !== ''),
      };

      const response = await axios.post('/api/admin/portfolio', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setMessage('Portfolio item added successfully!');
        setFormData({
          title: '',
          description: '',
          imageUrl: '',
          projectUrl: '',
          githubUrl: '',
          technologiesUsed: '',
        });
      } else {
        setError(response.data.message || 'Failed to add portfolio item.');
      }
    } catch (err) {
      console.error('Error adding portfolio item:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Failed to add portfolio item.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Add New Portfolio Item</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title:</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Description:</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={5}></textarea>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="imageUrl">Image URLs (comma-separated):</label>
            <input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="projectUrl">Project URL:</label>
            <input type="text" id="projectUrl" name="projectUrl" value={formData.projectUrl} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="githubUrl">GitHub URL:</label>
            <input type="text" id="githubUrl" name="githubUrl" value={formData.githubUrl} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="technologiesUsed">Technologies Used (comma-separated):</label>
            <input type="text" id="technologiesUsed" name="technologiesUsed" value={formData.technologiesUsed} onChange={handleChange} />
          </div>
          <button type="submit" className={styles.cardLink}>Add Item</button>
        </form>
        {message && <p className={styles.successMessage}>{message}</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
};

export default AddPortfolio;
