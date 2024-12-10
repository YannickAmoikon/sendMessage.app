// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import { authApi } from '@/services/auth.service';
import {messageApi} from "@/services/message.service";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        //@ts-ignore
        [messageApi.reducerPath]: messageApi.reducer,
    },
    //@ts-ignore
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, messageApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;