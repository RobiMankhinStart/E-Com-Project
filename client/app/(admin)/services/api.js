import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    // Add any custom headers if needed
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    console.log("RTK Query Error:", {
      status: result.error.status,
      data: result.error.data,
      url: args.url || args,
    });

    // If 401 Unauthorized, try to refresh token
    if (result.error.status === 401) {
      console.log("Token expired, attempting refresh...");
      const refreshResult = await baseQuery(
        { url: "/auth/refreshtoken", method: "POST" },
        api,
        extraOptions,
      );
      if (refreshResult.data) {
        console.log("Token refreshed successfully, retrying original request");
        result = await baseQuery(args, api, extraOptions);
      } else {
        console.log("Token refresh failed");
      }
    }
  }

  return result;
};

export const adminApiService = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["product", "category", "profile", "order", "user"],
  endpoints: (build) => ({
    getProducts: build.query({
      query: (params) => {
        const searchParams = params
          ? `?${new URLSearchParams(params).toString()}`
          : "";
        return "/product/allproducts" + searchParams;
      },
      providesTags: ["product"],
    }),
    getSingleProduct: build.query({
      query: ({ slug, admin } = {}) => {
        const query = admin ? `?admin=${admin}` : "";
        return "/product/" + slug + query;
      },
      providesTags: ["product"],
    }),
    getCategories: build.query({
      query: () => "/category/all",
      providesTags: ["category"],
    }),
    createNewProduct: build.mutation({
      query: (productData) => ({
        url: "/product/create",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["product"],
    }),
    updateProduct: build.mutation({
      query: ({ slug, data }) => ({
        url: "/product/update/" + slug,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["product"],
    }),
    deleteProduct: build.mutation({
      query: (productId) => ({
        url: "/product/" + productId,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),
    createNewCategory: build.mutation({
      query: (formData) => ({
        url: "/category/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["category"],
    }),
    getProfile: build.query({
      query: () => "/auth/profile",
      providesTags: ["profile"],
    }),
    updateUserProfile: build.mutation({
      query: (formData) => ({
        url: "/auth/profile",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["profile"],
    }),
    getOrders: build.query({
      query: () => "/order/all",
      providesTags: ["order"],
    }),
    getAllUsers: build.query({
      query: () => "/user/all",
      providesTags: ["user"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetSingleProductQuery,
  useGetCategoriesQuery,
  useCreateNewProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateNewCategoryMutation,
  useGetProfileQuery,
  useUpdateUserProfileMutation,
  useGetOrdersQuery,
  useGetAllUsersQuery,
} = adminApiService;
