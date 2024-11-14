// store.ts:
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './loginSlice';
import attackReducer from './attackSlice';


const store = configureStore({
  reducer: {
    user: userReducer,
    attack : attackReducer    
    
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 

export default store;
