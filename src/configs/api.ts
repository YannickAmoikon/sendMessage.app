import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const getAuthToken = () => {
    return localStorage.getItem('accessToken');
};

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://api-sacirba.sanlamconnect.com/api/v1',
    prepareHeaders: (headers) => {
        const token = getAuthToken();
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401 || result?.error?.status === 403) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
    }

    return result;
};

// Configuration centrale pour RTK Query
export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Posts', 'Users'],
    endpoints: (builder) => ({}),
});