import api from "./axios";

export const loginUser = async(Credentials)=>{
    const response = await api.post("/auth/login", {
        username,
        password,
    });
    return response.data;
}