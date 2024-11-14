// attackSlice.ts:
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AttackState, LaunchedMissile, LaunchRequest, Missile } from '../types/missileTypes';

const initialState  : AttackState= {
    missiles: [],
    launchedMissiles: [],
    isLoading: false,
    error: null
};
// לקלב מלאי טילים לפי אירגון
export const fetchMissiles = createAsyncThunk(
    'attack/fetchMissiles',
    async (organizationName : string) => {
    const response = await fetch(`http://localhost:3000/api/game/missiles/${organizationName}`);
    if (!response.ok) {
        throw new Error('Failed to fetch missiles');
    }
    const data = await response.json();
    return data as Missile[];
    }
);
//לשיגור טיל
export const launchMissile = createAsyncThunk(
    'attack/launchMissile',
    async (launchData: LaunchRequest) => {
      const response = await fetch('http://localhost:3000/api/game/launch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          missileType: launchData.missileName,
          sourceOrg: launchData.sourceOrg,
          targetArea: launchData.targetArea,
          launchTime: Date.now()
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to launch missile');
      }
      
      const data = await response.json();
      
      return {
        id: data.missileDetails._id,              
        name: data.missileDetails.name,           
        targetArea: launchData.targetArea,       
        launchTime: Date.now(),                  
        TimeToHit: data.estimatedImpactTime,      
        status: 'launched',
        sourceOrg: launchData.sourceOrg,
        missileSpeed: data.missileDetails.speed,                       
      } as LaunchedMissile;
    }
  );

const attackSlice = createSlice({
    name: 'attack',
    initialState,
    reducers: {
      //סוקט לעדכן סטטוס של טיל
      updateMissileStatus: (state, action) => {
        const { missileId, newStatus } = action.payload;
        const missile = state.launchedMissiles.find(m => m.id === missileId);
        if (missile) {
          missile.status = newStatus;
        }
      },
      
     
      decrementMissileAmount: (state, action) => {
        const { missileName } = action.payload;
        const missile = state.missiles.find(m => m.name === missileName);
        if (missile && missile.amount > 0) {
          missile.amount--;
        }
      },
  
      
      clearLaunchHistory: (state) => {
        state.launchedMissiles = [];
      }
    },
    extraReducers: (builder) => {
      builder
        //מלאי
        .addCase(fetchMissiles.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(fetchMissiles.fulfilled, (state, action) => {
          state.missiles = action.payload;
          state.isLoading = false;
        })
        .addCase(fetchMissiles.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message || 'Failed to fetch missiles';
        })
  
        //שיגור
        .addCase(launchMissile.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(launchMissile.fulfilled, (state, action) => {
          state.launchedMissiles.push(action.payload);
          state.isLoading = false;
        })
        .addCase(launchMissile.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message || 'Failed to launch missile';
        });
    },
  });
//יש לי פה אקשינם של עדכון סטטוס טיל לנקות היסטוריה שיגורים ולעדכן כמות טילים
export const { updateMissileStatus, decrementMissileAmount, clearLaunchHistory } = attackSlice.actions;

export default attackSlice.reducer;
  
  



