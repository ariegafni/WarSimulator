import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { RootState } from '@reduxjs/toolkit/query';
import { fetchMissiles, launchMissile, updateMissileStatus } from '../redux/attackSlice';
import { io } from 'socket.io-client';

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
    return TimeLeft > 0 ? Math.ceil(TimeLeft / 1000) : 0;
    console.log(TimeLeft);
    
  }
  if (isLoading) return <p>Loading...</p>;


  return (
    <div>
      Attack Page
    </div>
  )
}

export default AttackPage
