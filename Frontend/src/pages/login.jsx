import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './login.css'

const Login =()=>{
    const [email,setemail] = useState("");
    const [password,setPassword] = useState("");
    const [error,seterror]=useState("");
    const  navigate = useNavigate();

    const handleEvent =async(e)=>{
      e.preventDefault();
      seterror("");
      try{
        const res = await axios.post("http://localhost:5000/Users/login",{
            email,
            password
        });
        const data =res.data;
        localStorage.setItem("token",data.token);
        localStorage.setItem("user",data.user);
        if(data.user.role === "admin") {
            navigate('/admin');
        }
        else {
        navigate('/profile');
        }

      }catch(error){
        if(error.response.data.message){
            seterror(error.response.data.message);
        }
        else{
            seterror("login failed");
        }

      }
    }

    return(
        <div className="login-container">
            <form className="login-form" onSubmit={handleEvent}>
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <input type="email" value={email} placeholder="Email" onChange={(e)=>setemail(e.target.value)} required/>
                <input type="password" value={password} placeholder="Password" onChange={(e)=>setPassword(e.target.value)} required/>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login;