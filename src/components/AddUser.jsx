import React, { useState } from 'react'

const AddUser = ({submitUser}) => {
     const [firstName, setfirstName] = useState("")
      const [lastName, setlastName] = useState("")
      const [email, setemail] = useState("")
      const [profilePicture, setprofilePicture] = useState("")
  return (
    <div>
         <input type="text" placeholder='first name'  onChange={(e)=>setfirstName(e.target.value)}/>
    <input type="text" placeholder='last name'  onChange={(e)=>setlastName(e.target.value)}/>
    <input type="text" placeholder='email'  onChange={(e)=>setemail(e.target.value)}/>
    <input type="text" placeholder='Profile picture'  onChange={(e)=>setprofilePicture(e.target.value)}/>
    <button onClick={()=>submitUser({firstName, lastName, email, profilePicture})}>Submit</button>
    </div>
  )
}

export default AddUser