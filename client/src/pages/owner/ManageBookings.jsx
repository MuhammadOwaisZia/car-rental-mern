import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const ManageBookings = () => {
  const { backendUrl, token, currency } = useAppContext()
  const [bookings, setBookings] = useState([])

  const fetchOwnerBookings = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/owner/bookings`, {
        headers: { authorization: token }
      })
      if (data.success) setBookings(data.bookings)
    } catch (error) {
      console.log(error.message)
    }
  }

  const updateStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/owner/bookings/${bookingId}/status`,
        { status },
        { headers: { authorization: token } }
      )
      if (data.success) {
        toast.success(`Booking ${status}`)
        fetchOwnerBookings()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) fetchOwnerBookings()
  }, [token])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title title="Manage Bookings" subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses." />

      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Date Range</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium max-md:hidden">Customer</th>
              <th className="p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 && (
              <tr><td colSpan={5} className='p-4 text-center text-gray-400'>No bookings yet</td></tr>
            )}
            {bookings.map((booking, index) => (
              <tr key={index} className='border-t border-borderColor text-gray-500'>
                <td className='p-3 flex items-center gap-3'>
                  <img src={booking.car?.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover' />
                  <p className='font-medium max-md:hidden'>{booking.car?.brand} {booking.car?.model}</p>
                </td>
                <td className='p-3 max-md:hidden'>
                  {booking.startDate?.split('T')[0]} → {booking.endDate?.split('T')[0]}
                </td>
                <td className='p-3'>{currency}{booking.totalPrice}</td>
                <td className='p-3 max-md:hidden'>
                  <p>{booking.user?.name}</p>
                  <p className='text-xs text-gray-400'>{booking.user?.email}</p>
                </td>
                <td className='p-3'>
                  {booking.status === 'pending' ? (
                    <select
                      defaultValue="pending"
                      onChange={e => updateStatus(booking._id, e.target.value)}
                      className='px-2 py-1.5 text-gray-500 border border-borderColor rounded-md outline-none'
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirm</option>
                      <option value="cancelled">Cancel</option>
                    </select>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-500' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-500' :
                      booking.status === 'completed' ? 'bg-blue-100 text-blue-500' :
                      'bg-gray-100 text-gray-500'
                    }`}>{booking.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageBookings
