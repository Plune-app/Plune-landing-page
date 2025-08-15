import { AxiosError } from "axios";
import { useCallback } from "react";
import { toast } from "sonner";
export type AppAxiosError = AxiosError<{
  message: string;
  statusCode :number;
  code: string;
}>
export function useError() {

  const treatError = useCallback((err: AppAxiosError) => {
    if (err.response && err.response.data.message) {
      toast(err.response?.data.message)
    }
  }, []);
  return treatError
}