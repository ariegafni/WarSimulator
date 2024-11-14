import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>War simulator</h1>
       
        
        <div className={styles.buttonContainer}>
          <Link to="/login" className={`${styles.button} ${styles.userButton}`}>
         Login  
          </Link>
          <Link to="/register" className={`${styles.button} ${styles.adminButton}`}>
          Register
          </Link>
        </div>

        <div className={styles.footer}>
          <p>© 2024 War simulator System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;