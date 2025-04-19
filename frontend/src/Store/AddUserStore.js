import React from 'react'
import AddUserForm from '../Compoment/AddUser/AddUserForm'
import { createContext } from 'react'
import { useState } from 'react'

export const userContext = createContext()


export default function AddUserStore() {

     const[addData,setAddData]=useState({

            id:'',
            first_name:'',
            last_name:'',
            email:'',
            department:'',
            occupation:'',
            gender:'',
            type:'',
            user_name:'',
            password:'',
    
          })

  return (
            <userContext.Provider value={[addData,setAddData]}>
                     <AddUserForm></AddUserForm>
            </userContext.Provider>

  )
}
