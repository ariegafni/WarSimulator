// loginSlice.ts :
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from '../types/userTypes';

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ username, password }: { username: string; password: string }, thunkAPI) => {
    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      console.log('זה מהקובץ סליס לוג אין עם משתנה דאטה :',data);
      

      return {
        _id: data.user._id,
        username: data.user.username,
        organization: data.user.organization,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


 const userSlice = createSlice({
    name: 'user',
    initialState: {
      users: [] as User[],
      user: null as User | null,
      status: 'idle' as 'idle' | 'loading' | 'failed',
    },
    reducers: {
      logoutUser: (state) => {
        localStorage.removeItem('token');
        state.user = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(loginUser.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(loginUser.rejected, (state) => {
          state.status = 'failed';
        })
        .addCase(loginUser.fulfilled, (state, action) => {
          state.user = {
            _id: action.payload._id,
            username: action.payload.username,
            organization: action.payload.organization,
            location: null, 
          };
          state.status = 'idle';
        });
        
    },
 }) 
  export const { logoutUser } = userSlice.actions;
  export default userSlice.reducer;
  

