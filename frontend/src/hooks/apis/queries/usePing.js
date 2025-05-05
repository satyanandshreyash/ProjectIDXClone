import { useQuery } from "@tanstack/react-query";
import { pingAPI } from "../../../apis/ping";

export default function usePing() {
    const { isLoading, isError, data, error } = useQuery({
        queryFn: pingAPI,
        queryKey: "ping",
        staleTime: 5000,
    })
    return { isLoading, isError, data, error };
}