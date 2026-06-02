import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'

const MyBookings = () => {
  const { backendUrl, token, currency, setShowLogin } = useAppContext()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMyBookings = async () => {
    if (!token) { setLoading(false); return }
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/bookings`, {
        headers: { authorization: token }
      })
      if (data.success) setBookings(data.bookings)
    } catch (error) {
      console.log(error.message)
    }
    setLoading(false)
  }

  const cancelBooking = async (bookingId) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/user/bookings/${bookingId}/cancel`,
        {},
        { headers: { authorization: token } }
      )
      if (data.success) {
        toast.success('Booking cancelled')
        fetchMyBookings()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (!token) { setShowLogin(true); setLoading(false); return }
    fetchMyBookings()
  }, [token])

  if (loading) return <Loader />

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl'>
      <Title title="My Bookings" subTitle="View and manage all your car bookings" align="left" />

      {bookings.length === 0 ? (
        <p className='text-gray-400 text-center mt-20'>No bookings found.</p>
      ) : (
        <div>
          {bookings.map((booking, index) => (
            <div key={booking._id} className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12'>

              {/* Car Image + Info */}
              <div className='md:col-span-1'>
                <div className='rounded-md overflow-hidden mb-3'>
                  <img src={booking.car.image} alt="" className='w-full h-auto aspect-video object-cover' />
                </div>
                <p className='text-lg font-medium mt-2'>{booking.car.brand} {booking.car.model}</p>
                <p className='text-gray-500'>{booking.car.year} • {booking.car.category} • {booking.car.location}</p>
              </div>

              {/* Booking Info */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2">
                  <p className="px-3 py-1.5 bg-light rounded">Booking #{index + 1}</p>
                  <p className={`flex items-center justify-center px-3 py-1 text-xs rounded-full ${
                    booking.status === 'confirmed' ? 'bg-green-400/15 text-green-600' :
                    booking.status === 'cancelled' ? 'bg-red-400/15 text-red-600' :
                    booking.status === 'completed' ? 'bg-blue-400/15 text-blue-600' :
                    'bg-yellow-400/15 text-yellow-600'
                  }`}>{booking.status}</p>
                </div>

                <div className='flex items-start gap-2 mt-3'>
                  <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-1' />
                  <div>
                    <p className='text-gray-500'>Rental Period</p>
                    <p>{booking.startDate?.split('T')[0]} To {booking.endDate?.split('T')[0]}</p>
                  </div>
                </div>

                <div className='flex items-start gap-2 mt-3'>
                  <img src={assets.location_icon_colored} alt="" className='w-4 h-4 mt-1' />
                  <div>
                    <p className='text-gray-500'>Pick-Up Location</p>
                    <p>{booking.pickupLocation || booking.car.location}</p>
                  </div>
                </div>
              </div>

              {/* Price + Cancel */}
              <div className='flex flex-col justify-between gap-4'>
                <div className='text-sm text-gray-500 text-right'>
                  <p>Total Price</p>
                  <h1 className='text-2xl font-semibold text-primary'>{currency}{booking.totalPrice}</h1>
                  <p>Booked On {booking.createdAt?.split('T')[0]}</p>
                </div>

                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                  <button
                    onClick={() => cancelBooking(booking._id)}
                    className='text-sm text-red-500 border border-red-300 px-4 py-1.5 rounded-lg hover:bg-red-50 transition-all'
                  >
                    Cancel Booking
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBookings
