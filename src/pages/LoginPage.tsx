// LoginPage.tsx:
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from "../redux/store";
import styles from './LoginPage.module.css';
import { loginUser } from "../redux/loginSlice";
import { RootState } from '../redux/store';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const user = useSelector((state: RootState) => state.user.user); //ככה אני מביא את כל הפרטים של היוזר לכל מקום

  console.log(user?.organization);
  

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const userData = {
      username,
      password,   
    };
  
    try {
      const result = await dispatch(loginUser(userData)).unwrap();
      
      if(result){
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found');
          return;
        }
        
    if (result.organization === 'IDF - Center'  || user?.organization === 'IDF - North' || user?.organization === 'IDF - South'  || user?.organization === 'IDF - West Bank') {
      navigate('/defense');  
    } else {
      navigate('/attack');  
    }

      }
    } catch (error: any) {
      console.error(error, 'Failed to log in');
    }
  };
  
  

  return (
    <div className={styles.container}>
    <h2 className={styles.title}>Login</h2>
    <form onSubmit={handleLogin}>
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
      <button 
        type="submit" 
        
        className={styles.button}
      >
        submit
      </button>
     
      
    </form>
  </div>
  )
}

export default LoginPage
