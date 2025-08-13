import { User } from "@/@types/user";
import { UserSignInDTO, UserSignUpDTO } from "@/lib/DTO/user.dto";
import { api } from "@/service/api";
import { useUserStore } from "@/store/user";
import { useCallback } from "react"
import { useNavigate } from "react-router-dom";

export function useUser() {
  const PATH = "/users"
  const setSelectedOrganization = useUserStore(state => state.setSelectedOrganization);
  const clearUser = useUserStore(state => state.clearUser);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    clearUser();
    localStorage.removeItem("@plune-app/token")
    setSelectedOrganization(null)
    navigate("/")
  }, [clearUser]);

  const update = useCallback(() => { }, []);

  const signIn = useCallback(async (data: UserSignInDTO) => {
    const response = await api.post(PATH + "/signIn", data)
    return response.data
  }, []);

  const signUp = useCallback(async (data: UserSignUpDTO) => {
    const response = await api.post(PATH + "/signUp", data)
    return response.data
  }, []);
 
  const getUsersByEmail = useCallback(async(email: string) => {
    const response = await api.get(`/users?email=${email}`);
    return response.data as { data : User[]}
  }, [])
  return {
    getUsersByEmail,
    logout,
    update,
    signIn,
    signUp
  }
}