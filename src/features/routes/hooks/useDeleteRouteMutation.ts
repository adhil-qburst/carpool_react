import { useMutation, useQueryClient } from "@tanstack/react-query";
import { routesApi } from "../api/routes.api";
import { routeKeys } from "./routeKeys";

export function useDeleteRouteMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (routeId: string) => routesApi.delete(routeId),
    onSuccess: (_, routeId) => {
      queryClient.invalidateQueries({ queryKey: routeKeys.lists() });
      queryClient.removeQueries({ queryKey: routeKeys.detail(routeId) });
    },
  });
}
