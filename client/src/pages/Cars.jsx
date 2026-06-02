import React, { useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CarCard from '../components/CarCard'
import { useAppContext } from '../context/AppContext'

const Cars = () => {
  const { cars } = useAppContext()
  const [input, setInput] = useState('')

  const filteredCars = cars.filter(car =>
    `${car.brand} ${car.model} ${car.category} ${car.location}`
      .toLowerCase()
      .includes(input.toLowerCase())
  )

  return (
    <div>
      <div className='flex flex-col items-center py-20 bg-light max-md:px-4'>
        <Title title='Available Cars' subTitle='Browse our selection of premium vehicles available for your next adventure' />

        <div className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'>
          <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2' />
          <input
            onChange={e => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder='Search by make, model, or features'
            className='w-full h-full outline-none text-gray-500'
          />
          <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 ml-2' />
        </div>
      </div>

      <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'>
        <p className='text-gray-500 xl:px-20 max-w-7xl mx-auto'>Showing {filteredCars.length} Cars</p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
          {filteredCars.map((car, index) => (
            <div key={index}>
              <CarCard car={car} />
            </div>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <p className='text-center text-gray-400 mt-20'>No cars found.</p>
        )}
      </div>
    </div>
  )
}

export default Cars
