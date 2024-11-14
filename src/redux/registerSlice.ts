// registerSlice.ts:
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface User {
  _id: string;
  username: string;
  password?: string;
  organization: string;
  location: string | null;
}

interface UserState {
  users: User[];
  user: User | null;
  status: 'idle' | 'loading' | 'failed';
}


const initialState: UserState = {
  users: [],
  user: null,
  status: 'idle',
};

export const registerUser = createAsyncThunk(
    'user/registerUser',
    async ({ username, password, organization, area, location }: { username: string; password: string; organization: string; area: string | undefined; location: string | undefined }, thunkAPI) => {
      try {
        const response = await fetch('http://localhost:3000/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, organization, area, location }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed');
        }
  
        const data = await response.json();
        localStorage.setItem('token', data.token);
  
        return {
          _id: data.user._id,
          username: data.user.username,
          organization: data.user.organization,
          location: data.user.location,
        };
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
  
const userSlice = createSlice({
  name: 'user',
  initialState, 
  reducers: {
    logoutUser: (state) => {
      localStorage.removeItem('token');
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = {
          _id: action.payload._id,
          username: action.payload.username,
          organization: action.payload.organization,  
          location: action.payload.location,          
        };
        state.status = 'idle';
      });
      
      
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
