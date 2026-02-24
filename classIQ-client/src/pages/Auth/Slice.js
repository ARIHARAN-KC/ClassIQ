import { emptySplitApi } from "../../pages/Auth/apiSlice";

export const signUpApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSignUpMutation } = signUpApi;