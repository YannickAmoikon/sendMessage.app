import { api } from "@/configs/api";

interface SendMessagePayload {
    phones: string[];
    body: string;
}

interface SendMessageResponse {
    success: boolean;
    message?: string;
}

export const messageApi = api.injectEndpoints({
    endpoints: (builder) => ({
        message: builder.mutation<SendMessageResponse, SendMessagePayload>({
            query: (payload) => ({
                url: "/message/send-message",
                method: "POST",
                body: payload,
            }),
        }),
    }),
});

export const { useMessageMutation } = messageApi;
