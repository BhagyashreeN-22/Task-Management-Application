import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './register.css';

const Register=()=>{
    const [name,setname] =useState("");
    const [email,setemail] =useState("");
    const [password,setPassword] =useState("");
    const [role,setrole] =useState("");
    const [error,seterror]=useState("");
    const navigate = useNavigate();

    const handleEvent=async (e)=>{
      e.preventDefault();
      seterror("");
      try{
        const res= await axios.post('http://localhost:5000/Users/register',{
            name,
            email,
            password,
            role
        });
        navigate('/login');
        }catch(err){
       if (err.response && err.response.data && err.response.data.message) {
             setError(err.response.data.message);
        }
        else{
            seterror("login failed");
        }
      }
    }
    return(
        <div className="register-container">
            <form className="register-form" onSubmit={handleEvent}>
                <h1 className="title">Register</h1>
                {error && <p className="error">{error}</p>}
                <input type="name" value={name} placeholder="name" onChange={(e)=>setname(e.target.value)} required/>
                <input type="email" value={email} placeholder="Email" onChange={(e)=>setemail(e.target.value)} required/>
                <input type="password" value={password} placeholder="Password" onChange={(e)=>setPassword(e.target.value)} required/>
                <input type="role" value={role} placeholder="Role" onChange={(e)=>setrole(e.target.value)}/>
                <button type="submit">Register</button>
            </form>
        </div>
    )

}

export default Register;