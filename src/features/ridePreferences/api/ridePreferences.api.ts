import { apiEndpoints } from "@core/api/apiEndpoints";
import { httpClient } from "@core/api/httpClient";
import type {
  CreateRidePreferenceRequest,
  ListRidePreferencesQueryParams,
  MatchingRidePreferencesQueryParams,
  RidePreferenceResponse,
  UpdateRidePreferenceRequest,
} from "../types/ridePreferences.api.types";

export const ridePreferencesApi = {
  create: (
    payload: CreateRidePreferenceRequest,
  ): Promise<RidePreferenceResponse> =>
    httpClient
      .post<RidePreferenceResponse>(apiEndpoints.ridePreferences.create, payload)
      .then((res) => res.data),

  list: (
    params?: ListRidePreferencesQueryParams,
  ): Promise<RidePreferenceResponse[]> =>
    httpClient
      .get<RidePreferenceResponse[]>(apiEndpoints.ridePreferences.list, {
        params,
      })
      .then((res) => res.data),

  getMatches: (
    params: MatchingRidePreferencesQueryParams,
  ): Promise<RidePreferenceResponse[]> =>
    httpClient
      .get<RidePreferenceResponse[]>(apiEndpoints.ridePreferences.matches, {
        params,
      })
      .then((res) => res.data),

  getById: (preferenceId: string): Promise<RidePreferenceResponse> =>
    httpClient
      .get<RidePreferenceResponse>(
        apiEndpoints.ridePreferences.byId(preferenceId),
      )
      .then((res) => res.data),

  update: (
    preferenceId: string,
    payload: UpdateRidePreferenceRequest,
  ): Promise<RidePreferenceResponse> =>
    httpClient
      .patch<RidePreferenceResponse>(
        apiEndpoints.ridePreferences.update(preferenceId),
        payload,
      )
      .then((res) => res.data),

  delete: (preferenceId: string): Promise<void> =>
    httpClient
      .delete<void>(apiEndpoints.ridePreferences.delete(preferenceId))
      .then((res) => res.data),
};
