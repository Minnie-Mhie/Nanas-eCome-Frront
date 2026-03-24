import React from 'react'

const Button = ({title, color, func}) => {
  // console.log(props);

  let myName ="pampam"
  
  return (
    <button className={`btn ${color}`} onClick={()=>func(myName)}>
       {title}
    </button>
  )
}

export default Button