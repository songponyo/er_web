import React from 'react'

import { AuthConsumer, } from '../role-accress/authContext'

const MainLayout = React.lazy(() => import('./MainLayout'))
const Login = React.lazy(() => import('../views/pages/login/Login'))

const HomePage = () => {
  return (
    <AuthConsumer>
      {({ authenticated }) => authenticated ? <MainLayout /> : <Login />}
    </AuthConsumer>
  )
}

export default HomePage
