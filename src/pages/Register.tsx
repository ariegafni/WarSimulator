// Register.tsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../redux/registerSlice";
import { AppDispatch } from "../redux/store";
import { useNavigate } from'react-router-dom';
import styles from './Register.module.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [area, setArea] = useState('');  
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userData = {
      username,
      password,
     
      organization: organization === 'IDF' ? `IDF - ${area}` : organization,
      area: undefined, 
      location: undefined
    };

    try {
      await dispatch(registerUser(userData));
      alert('User registered successfully');
      navigate('/login');
    } catch (error) {
      console.error('Failed to register', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>User Registration</h2>
      <form onSubmit={handleRegister}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className={styles.input} 
            required 
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className={styles.input} 
            required 
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Organization:</label>
          <select 
            value={organization} 
            onChange={(e) => {
              setOrganization(e.target.value);
              if (e.target.value !== 'IDF') {
                setArea('');  
              }
            }} 
            className={styles.input} 
            required
          >
            <option value="">Select organization</option>
            <option value="IDF">IDF</option>
            <option value="Hamas">Hamas</option>
            <option value="Hezbollah">Hezbollah</option>
            <option value="IRGC">IRGC</option>
            <option value="Houthis">Houthis</option>
          </select>
        </div>

        {organization === 'IDF' && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Area:</label>
            <select 
              value={area} 
              onChange={(e) => setArea(e.target.value)} 
              className={styles.input} 
              required
            >
              <option value="">Select area</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="Center">Center</option>
              <option value="West Bank">West Bank</option>
            </select>
          </div>
        )}

        <button type="submit" className={styles.button}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;