import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch ,RootState} from '../redux/store';

import { fetchMissiles, launchMissile, updateMissileStatus } from '../redux/attackSlice';
import { io } from 'socket.io-client';
import styles from './AttackPage.module.css';

const AREAS = ['North', 'South', 'Center', 'Judea and Samaria'];

const AttackPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const { missiles, launchedMissiles, isLoading } = useSelector((state: RootState) => state.attack);

  const [selectedArea, setSelectedArea] = useState('');
  const [selectedMissile, setSelectedMissile] = useState('');

  useEffect(() => {
    if (!user?.organization) return;
    dispatch(fetchMissiles(user.organization));

    const socket = io('http://localhost:3000');

    socket.on('missile-status-update', (data) => {
      dispatch(updateMissileStatus(data));
    });
    return () => {
      socket.disconnect();
    };
  }, [dispatch, user?.organization]);

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArea || !selectedMissile || !user?.organization) return;

    try {
      await dispatch(launchMissile({
        missileName: selectedMissile,
        targetArea: selectedArea,
        sourceOrg: user.organization
      })).unwrap();

      setSelectedArea('');
      setSelectedMissile('');
    } catch (error) {
      console.error('Launch failed:', error);
    }
  };

  const calculateTimeRemaining = (missile : any) => {
    const TimeLeft = missile.TimeToHit - Date.now();
    return TimeLeft > 0 ? Math.ceil(TimeLeft / 1000) : null;
    
  }
  if (isLoading) return <p>Loading...</p>;


  return (
    <div className={styles.container}>
    <header className={styles.header}>
      <h1>{user?.organization} Control Panel</h1>
    </header>
   
    <section className={styles.inventorySection}>
      <h2>Missile Inventory</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Missile Name</th>
            <th>Amount Available</th>
          </tr>
        </thead>
        <tbody>
          {missiles.map(missile => (
            <tr key={missile.name}>
              <td>{missile.name}</td>
              <td>{missile.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>

    
    <div className={styles.launchSection}>
      <h2>Launch Missile</h2>
      <form onSubmit={handleLaunch} className={styles.launchForm}>
        <select 
          value={selectedArea} 
          onChange={(e) => setSelectedArea(e.target.value)}
          required
        >
          <option value="">Select Target Area</option>
          {AREAS.map(area => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>

        <select 
          value={selectedMissile} 
          onChange={(e) => setSelectedMissile(e.target.value)}
          required
        >
          <option value="">Select Missile</option>
          {missiles.filter(m => m.amount > 0).map(missile => (
            <option key={missile.name} value={missile.name}>
              {missile.name}
            </option>
          ))}
        </select>

        <button type="submit">Launch</button>
      </form>
    </div>

   
    <div className={styles.launchHistorySection}>
      <h2>Active Launches</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Missile</th>
            <th>Target Area</th>
            <th>Time to Impact</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
        {launchedMissiles.map((missile, index) => (
            <tr key={`${missile.name}-${missile.launchTime}-${index}`}>
              <td>{missile.name}</td>
              <td>{missile.targetArea}</td>
              <td>{calculateTimeRemaining(missile)}s</td>
              <td className={styles[missile.status]}>{missile.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  )
}

export default AttackPage
