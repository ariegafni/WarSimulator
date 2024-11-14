// userTypes.ts :
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
  
  export const initialState: UserState = {
    users: [],
    user: null, 
    status: 'idle',
  };
  
