import { api } from '@/configs/api';

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<
            { token: string; user: { id: number; email: string } },
            { email: string; password: string }
        >({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),

        getUser: builder.query<
            { id: number; email: string },
            void
        >({
            query: () => '/auth/me',
        }),
    }),
    overrideExisting: false,
});

export const { useLoginMutation, useGetUserQuery } = authApi;