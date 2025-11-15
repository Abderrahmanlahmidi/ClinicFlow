import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './sections/sidebar'




export default function dashboard() {
  return (

    <div className="flex min-h-screen">
       <Sidebar/>
      <div className="flex-1 bg-gray-50 p-6">
        <Outlet/>
      </div>
    </div>
  )
}

