import React from 'react'
import { useNavigate } from 'react-router-dom';
import {FaReact} from "react-icons/fa";
import "./Welcome.css"

export default function WelcomePage() {

     const navigate = useNavigate();

  return (
    <div className='welcome-container'>
        <div className='logo-circle'>
           <img src='/favicon black.jpeg' alt='logo' className='logo-img' />
        </div>
      <h4 className='welcome-subtitle'>"i can fullfill your thinking</h4>
      <h1 className='welcome-title'>what i can do for you today ? </h1>
  <p className='welcome-quote'> 💫 "the future belongs to those who belive in the beauty of their dreams ." 💫</p>
      <button onClick={()=>navigate('/getstarted')} className='start-btn'> < FaReact className='react-icon'/>GetStarted</button>
    </div>
  );
}
