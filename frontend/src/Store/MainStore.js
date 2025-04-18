import React from 'react'
import PageRoute from '../PageRoute/PageRoute'
import { useState } from 'react'
import { createContext } from 'react'


export const userPageContext = createContext()

export default function MainStore() {

  
      const[PageData,setPageData]=useState({
          Page:'page'
          // Home:'activateHome',
          // addUser:'deactivateUser',
          // setting:'deactivateSetting',
          // setBody:'Home',
          // EmployeeType:'',
          // workChecked:false,
          // ToggleSet:'card'
        })

  return (

        <userPageContext.Provider value={[PageData,setPageData]}>
        <PageRoute></PageRoute>
        </userPageContext.Provider>
  )
}
