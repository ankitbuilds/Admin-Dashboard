import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {loginUser} from "../api/authApi";

function Login(){
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange=(e)=>{
        const {name, value} = e.target;

        setFormData((prev)=>({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async(e)=>{
        e.preventDefault();

        if(loading) return;

        setError("");

        if(!formData.username || !formData.password){
            setError("Username and password are required");
            return;
        }
        try{
            setLoading(true);
            const data = await loginUser(formData);

            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("user", JSON.stringify(data));
            navigate("/products");
        } catch(error){
            setError(
                error.response?.data?.message||
                "Invalid username or password."
            );
        } finally{
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>Admin Login</h1>

                <div>
                    <label>Username</label>

                    <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter Username"/>
                </div>

                <div>
                    <label>Password</label>

                    <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"/>
                </div>

                {error &&(
                    <p className="login-error">{error}</p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

            </form>
        </div>
    );
}
export default Login;




