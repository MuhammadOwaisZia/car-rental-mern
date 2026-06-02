import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const Login = () => {
  const { backendUrl, setToken, setShowLogin } = useAppContext()
  const [state, setState] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (state === 'register') {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password })
        if (data.success) {
          setToken(data.token)
          localStorage.setItem('token', data.token)
          toast.success('Account created successfully!')
          setShowLogin(false)
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password })
        if (data.success) {
          setToken(data.token)
          localStorage.setItem('token', data.token)
          toast.success('Logged in successfully!')
          setShowLogin(false)
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <form onSubmit={onSubmitHandler} className='bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative'>

        {/* Close Button */}
        <button type="button" onClick={() => setShowLogin(false)} className='absolute top-4 right-4 cursor-pointer'>
          <img src={assets.close_icon} alt="close" className='w-4 h-4' />
        </button>

        <h2 className='text-2xl font-bold mb-1'>{state === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <p className='text-gray-500 text-sm mb-6'>{state === 'login' ? 'Login to access your account' : 'Sign up to get started'}</p>

        {state === 'register' && (
          <div className='mb-4'>
            <label className='text-sm text-gray-600'>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='Enter your name'
              required
              className='w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary'
            />
          </div>
        )}

        <div className='mb-4'>
          <label className='text-sm text-gray-600'>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='Enter your email'
            required
            className='w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary'
          />
        </div>

        <div className='mb-6'>
          <label className='text-sm text-gray-600'>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder='Enter your password'
            required
            className='w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary'
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className='w-full bg-primary hover:bg-primary-dull transition-all text-white py-2.5 rounded-lg font-medium cursor-pointer'
        >
          {loading ? 'Please wait...' : state === 'login' ? 'Login' : 'Create Account'}
        </button>

        <p className='text-center text-sm text-gray-500 mt-4'>
          {state === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => setState(state === 'login' ? 'register' : 'login')}
            className='text-primary cursor-pointer font-medium'
          >
            {state === 'login' ? 'Sign Up' : 'Login'}
          </span>
        </p>

      </form>
    </div>
  )
}

export default Login
