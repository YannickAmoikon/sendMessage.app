// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import { authApi } from '@/services/auth.service';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer, // Reducer pour RTK Query (auth)
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware), // Middleware RTK Query
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;