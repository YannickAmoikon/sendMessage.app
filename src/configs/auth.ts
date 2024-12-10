import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of the auth state
export interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    user: any; // Replace 'any' with your user type if you have one
}

// Initial state with safe initialization
const initialState: AuthState = {
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
    user: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ token: string; user?: any }>) => {
            const { token, user } = action.payload;
            state.token = token;
            state.isAuthenticated = true;
            state.user = user || null;

            // Only set localStorage in browser environment
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', token);
            }
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;

            // Only remove localStorage in browser environment
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;