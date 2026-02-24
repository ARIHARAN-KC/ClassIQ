import { emptySplitApi } from "../../pages/api/apiSlice";

const loginApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",          
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AppUser"],
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation } = loginApi;