import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: number;
    email: string;
}

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    user: User | null;
}

const initialState: AuthState = {
    token: null,
    isAuthenticated: false,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (
            state,
            action: PayloadAction<{ token: string; user: User }>
        ) => {
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;