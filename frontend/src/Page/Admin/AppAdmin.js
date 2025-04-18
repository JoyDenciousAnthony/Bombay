import React from 'react'
import { useContext } from 'react';
import { userPageContext } from '../../Store/MainStore';
import { useEffect } from 'react';
import AppLayout from '../../Layout/AppLayout';


export default function AppAdmin() {

    const [PageData,setPageData]=useContext(userPageContext)

    useEffect (()=>{
      setPageData({...PageData,Page:'Admin'})
    },[PageData,setPageData]);
  
  return (
    <div>
         <AppLayout></AppLayout>
    </div>
  )
}
