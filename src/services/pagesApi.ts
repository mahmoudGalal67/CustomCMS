// src/services/PagesApi.ts
import { baseApi } from "./baseApi";

export const pageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPage: builder.query({
            query: () => ({ url: "/pages", method: "GET" }),
            providesTags: ["pages"],
        }),

        addToUserPage: builder.mutation({
            query: (data) => ({
                url: "/pages",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["pages"],
        }),
        removeFromPage: builder.mutation({
            query: (id) => ({
                url: `/pages/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["pages"],
        }),
        mergePage: builder.mutation({
            query: () => ({
                url: "/pages/merge",
                method: "pages",
            }),
            invalidatesTags: ["pages"],
        }),
    }),
});

export const {
    useGetPageQuery,
    useAddToUserPageMutation,
    useRemoveFromPageMutation,
    useMergePageMutation,
} = pageApi;
