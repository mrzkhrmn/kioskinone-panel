import { baseApi } from "./baseApi";

const kioskParameterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getParameterHospitals: builder.query({
      query: () => "/KioskParameter/Hospitals",
    }),
    getParameterDepartments: builder.query({
      query: ({ hospitalId }) => ({
        url: `/KioskParameter/Departments/${hospitalId}`,
        method: "GET",
      }),
    }),
    getParameterKiosks: builder.query({
      query: ({ hospitalId, departmentId }) => ({
        url: `/KioskParameter/Kiosks`,
        method: "GET",
        params: { hospitalId, departmentId },
      }),
    }),
    getScopeParameters: builder.query({
      query: ({ hospitalId, departmentId, kioskId, level }) => ({
        url: `/KioskParameter/ScopeParameters`,
        method: "POST",
        body: { hospitalId, departmentId, kioskId, level },
      }),
      providesTags: ["KioskParameter"],
    }),
    saveParameterValue: builder.mutation({
      query: (body) => ({
        url: `/KioskParameter/SaveValue`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["KioskParameter"],
    }),
    removeOverride: builder.mutation({
      query: (body) => ({
        url: `/KioskParameter/RemoveOverride`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["KioskParameter"],
    }),
  }),
});

export const {
  useGetParameterHospitalsQuery,
  useGetParameterDepartmentsQuery,
  useGetKiosksQuery,
  useGetScopeParametersQuery,
  useSaveParameterValueMutation,
  useRemoveOverrideMutation,
} = kioskParameterApi;

export { kioskParameterApi };
