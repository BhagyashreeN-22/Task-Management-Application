import { useNavigate } from 'react-router-dom';
import './home.css';

const Home =()=>{
    const navigate = useNavigate();
        return(
        <div className='home-container'>
          <div className='home-content'>
            <h1 className='home-title'>TASK MANAGEMENT</h1>
            <p className="home-description">TaskFlow is your personal task management app to track, prioritize, and complete your daily tasks efficiently.
            </p>
            <div className='home-buttons'>
                <button className='btn-register' onClick={()=>navigate('/register')}>Register</button>
                <button className='btn-login' onClick={()=>navigate('/login')}>Login</button>
            </div>
          </div>
        </div>
    )
}

export default Home;