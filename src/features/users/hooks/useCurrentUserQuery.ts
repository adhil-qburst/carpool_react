import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../api/users.api";
import { userKeys } from "./userKeys";
import { tokenStorage } from "@core/auth/tokenStorage";

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: userKeys.currentUser(),
    queryFn: () => usersApi.getCurrentUser(),
    enabled: !!tokenStorage.getAccessToken(),
  });
}
