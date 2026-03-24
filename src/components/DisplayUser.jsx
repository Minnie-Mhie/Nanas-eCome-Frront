import React, { useState } from 'react'

const DisplayUser = ({allUsers, deleteUser, editUser}) => {
    const [firstName, setfirstName] = useState("")
          const [lastName, setlastName] = useState("")
          const [email, setemail] = useState("")
          const [profilePicture, setprofilePicture] = useState("")
          const [currentIndex, setcurrentIndex] = useState(0)


         
  return (
    <div>
        <div>
        {
          allUsers.map((user, index)=>(
            <div className="card" style={{width: "18rem"}} key={index}>
            <img src={user.profilePicture} className="card-img-top" alt="..."/>
            <div className="card-body">
              <h5 className="card-title">{user.firstName+" "+ user.lastName}</h5>
              <p className="card-text">{user.email}</p>
             <div>
             <button className='btn btn-dark' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={()=>setcurrentIndex(index)}>Edit</button>
             <button className='btn btn-danger' onClick={()=>deleteUser(index)}>Delete</button>
             </div>
            </div>
          </div>
          ))
        }
      </div>



      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <input type="text" placeholder='first name'  onChange={(e)=>setfirstName(e.target.value)}/>
    <input type="text" placeholder='last name'  onChange={(e)=>setlastName(e.target.value)}/>
    <input type="text" placeholder='email'  onChange={(e)=>setemail(e.target.value)}/>
    <input type="text" placeholder='Profile picture'  onChange={(e)=>setprofilePicture(e.target.value)}/>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary" onClick={()=>editUser(currentIndex, {firstName, lastName, email, profilePicture})} data-bs-dismiss="modal">Save changes</button>
      </div>
    </div>
  </div>
</div>
    </div>
  )
}

export default DisplayUser