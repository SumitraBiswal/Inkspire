import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./getstarted.css"

export default function GetStarted() {
    const navigate = useNavigate();
  return (
    <div className='get-container'>
     <h1 className='main-title'>Explore,Collect,Inkspire</h1>
     <h2 className='sub-title'>Read,Learn,Grow</h2>
     <h4 className='tagline'>every book is a joureny . Start yours today</h4>
     <button onClick={()=>navigate('/login')} className='log-btn'>login</button>
     <h5 className='signup-text'> Don't have an account ?
         <span onClick={()=> navigate('/signup')} className='signup-link'>Sign up</span> </h5>
    </div>
  );
}
