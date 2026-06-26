import { baseApi } from "./baseApi";

const kioskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getKiosks: builder.query({
      query: ({ hospitalId, departmentId }) => ({
        url: `/Kiosk/List`,
        method: "GET",
        params: { hospitalId, departmentId },
      }),
    }),
    createKiosk: builder.mutation({
      query: (kiosk) => ({
        url: `/Kiosk/Create`,
        method: "POST",
        body: kiosk,
      }),
      invalidatesTags: ["Kiosk"],
    }),
    updateKiosk: builder.mutation({
      query: (kiosk) => ({
        url: `/Kiosk/Update`,
        method: "POST",
        body: kiosk,
      }),
      invalidatesTags: ["Kiosk"],
    }),
    deleteKiosk: builder.mutation({
      query: (id) => ({
        url: `/Kiosk/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Kiosk"],
    }),
  }),
});

export const {
  useGetKiosksQuery,
  useCreateKioskMutation,
  useUpdateKioskMutation,
  useDeleteKioskMutation,
} = kioskApi;
