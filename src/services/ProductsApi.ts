// services/apiSlice.js
import { baseApi } from "./baseApi";

// Step 1: Create API slice
export const ProductSlice = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Step 2: Define endpoints
        getProducts: builder.query<any, { search?: string; category?: string }>({
            query: ({ search, category }) => ({
                url: "/products",
                params: { search, category },
            }),
            providesTags: ["Products"],
        }),
        getProductsName: builder.query({
            query: () => ({
                url: "/products/all/names",
            }),
            providesTags: ["Products"],
        }),
        getProductsByNamesOrIds: builder.query({
            query: ({ ids, names }) => ({
                url: "/products/all/filterByNames",
                params: { ids, names }
            }),
        }),
        getProductById: builder.query({
            query: (id: string) => ({
                url: `/products/${id}`,
            }),
            providesTags: ["Products"],
        }),
    }),
});

// Step 3: Export hooks for components
export const {
    useGetProductsQuery,
    useGetProductsNameQuery,
    useGetProductsByNamesOrIdsQuery,
    useGetProductByIdQuery,
} = ProductSlice;
