import { createSlice } from "@reduxjs/toolkit";

const appSlice =createSlice({
    name:"appSlice",
    initialState:{
        firstName:"Pampam",
        lastName:"",
        email:"",
        friends:['nony', 'cynthia', "lovely", ]
    },

    reducers:{
       changeFirst:(state)=>{
            state.firstName="Josh"
       } ,

       changeNameWithSome:(state, actions)=>{
            state.firstName= actions.payload
       }
    }

    
})

export default appSlice.reducer

export const {changeFirst, changeNameWithSome} = appSlice.actions