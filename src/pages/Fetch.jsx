import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Fetch = () => {
    const [name, setname] = useState("Pampam")
    const [number, setnumber] = useState(0)
    const [allUsers, setallUsers] = useState([])
    const [filtered, setfiltered] = useState([])
    const [searched, setsearched] = useState("")
    


    useEffect(() => {
        console.log("use effect ran")

        const makeRequest=async()=>{
            try {
                let data = await axios.get('https://jsonplaceholder.typicode.com/users')
                console.log(data.data);
                setallUsers(data.data)
                
            } catch (error) {
                console.log(error);
                
            }
        }

        makeRequest()
    },[name])

    useEffect(() => {
        const filterUsers=()=>{
            let copiedUsers = [...allUsers]
           let users= copiedUsers.filter(user=>user.username.includes(searched))
            setfiltered(users)
        }

        filterUsers()
    }, [searched, allUsers])
    

    //without  dependency array, use effect runs onload, amnd when any state changes in the component it runs again
    //empty dep array->onload runs, when any state changes it doesnt run
    //dep array with a state->onload it runs , it then runs when that particular state changes


    
  return (
    <div>
        <input type="text" onChange={(e)=>setsearched(e.target.value)} />

        <button className='btn btn-dark' onClick={()=>setname("Josh")}>{name}</button>

        <button className='btn btn-dark' onClick={()=>setnumber(number+1)}>{number}</button>


       <div className='d-flex flex-wrap gap-3'>
       {
            filtered.map((user, index)=>(
                <div class="card" style={{width: "18rem"}} key={index}>
                    <div class="card-body" >
                        <h5 class="card-title">{user.name}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">{user.username}</h6>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                        <a href="#" class="card-link">Card link</a>
                        <a href="#" class="card-link">Another link</a>
                    </div>
                </div>
            ))
        }
       </div>
    </div>
  )
}

export default Fetch