import React from 'react'
import { useNavigate } from 'react-router-dom'
import "../App.css"

const NotFound = () => {
    const navigate = useNavigate()
  return (
    <div>
        
        <h1 className='notfound'>404 - Page Not Found</h1>

        <button className='btn btn-dark' onClick={()=>navigate('/', {replace:true})}>Go Back Home</button>
    </div>
  )
}

export default NotFound