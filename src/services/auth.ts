import { $axios } from "@/utils/request";
import type { AxiosPromise } from "axios";
import type { LoginRequest, LoginResponse, ResponseData, User, UserProfile } from "@/types/models";

interface AuthRequest {
  token: string;
}

class AuthServiceClass {
  loginWithGoogle = (data: AuthRequest): AxiosPromise<LoginResponse<User>> =>
    $axios.post("/api/v1/auth/loginGoogle", data);

  login = (data: LoginRequest): AxiosPromise<LoginResponse<User>> => $axios.post("/api/v1/login", data);

  logout = (): AxiosPromise => $axios.post("/api/v1/auth/logout");

  getProfile = (): AxiosPromise<ResponseData<UserProfile>> => $axios.get("/api/v1/user/profile");

  register = (data: Partial<User>): AxiosPromise<User> => $axios.post("api/v1/auth/register", data);
}

export const AuthService = new AuthServiceClass();
