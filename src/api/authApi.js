import api from "./axios";

export const loginUser = async(Credentials)=>{
    const response = await api.post("/auth/login", credentials);
    return response.data;
}