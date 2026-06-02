import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Cars from './pages/Cars'
import CarDetails from './pages/CarDetails'
import MyBookings from './pages/MyBookings'
import Layout from './pages/owner/Layout'
import Dashboard from './pages/owner/Dashboard'
import AddCar from './pages/owner/AddCar'
import ManageCars from './pages/owner/ManageCars'
import ManageBookings from './pages/owner/ManageBookings'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './components/Login'
import { useAppContext } from './context/AppContext'

const App = () => {
  const { showLogin } = useAppContext()

  return (
    <div>
      {showLogin && <Login />}
      <Routes>
        {/* Public routes with Navbar + Footer */}
        <Route path='/' element={<><Navbar /><Home /><Footer /></>} />
        <Route path='/cars' element={<><Navbar /><Cars /><Footer /></>} />
        <Route path='/car-details/:id' element={<><Navbar /><CarDetails /><Footer /></>} />
        <Route path='/my-bookings' element={<><Navbar /><MyBookings /><Footer /></>} />

        {/* Owner routes */}
        <Route path='/owner' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='add-car' element={<AddCar />} />
          <Route path='manage-cars' element={<ManageCars />} />
          <Route path='manage-bookings' element={<ManageBookings />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
