import React from 'react'
import { Header } from './Header'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export const PrivateLayout = () => {
  return (
    <>
      {/*Cabecera*/}
      <Header />

      {/*Contenido principal*/}
      <section className='layout__content'>
        <Outlet />
      </section>

      {/*Barra lateral*/}
      <Sidebar />
    </>
  )
}
