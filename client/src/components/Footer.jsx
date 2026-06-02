import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-24 text-sm text-gray-500'>
      
      
      <div className='flex flex-col md:flex-row gap-8 pb-6 border-b border-borderColor'>

       
        <div className='md:flex-none md:w-auto'>
          <img src={assets.logo} alt="logo" className='h-8 md:h-9' />
          <p className='mt-3 max-w-xs'>
            Experience premium car rentals with a wide range of luxury and everyday vehicles, tailored to meet all your driving needs.
          </p>
          <div className='flex items-center gap-3 mt-6'>
            <a href="#"><img src={assets.facebook_logo} className='w-5 h-5' alt="Facebook" /></a>
            <a href="#"><img src={assets.instagram_logo} className='w-5 h-5' alt="Instagram" /></a>
            <a href="#"><img src={assets.twitter_logo} className='w-5 h-5' alt="Twitter" /></a>
            <a href="#"><img src={assets.gmail_logo} className='w-5 h-5' alt="Gmail" /></a>
          </div>
        </div>


        <div className='flex-1 flex flex-wrap md:flex-nowrap gap-8'>
          <div className='flex-1 min-w-[120px]'>
            <h2 className='text-base font-medium text-gray-800 uppercase'>Quick Links</h2>
            <ul className='mt-3 flex flex-col gap-1.5'>
              <li><a href="#">Home</a></li>
              <li><a href="#">Browse Cars</a></li>
              <li><a href="#">List Your Cars</a></li>
              <li><a href="#">About Us</a></li>
            </ul>
          </div>

          
          <div className='flex-1 min-w-[120px]'>
            <h2 className='text-base font-medium text-gray-800 uppercase'>Resources</h2>
            <ul className='mt-3 flex flex-col gap-1.5'>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Terms Of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Insurance</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className='flex-1 min-w-[120px]'>
            <h2 className='text-base font-medium text-gray-800 uppercase'>Contact</h2>
            <ul className='mt-3 flex flex-col gap-1.5'>
              <li>DHA - Elite Drive</li>
              <li>Karachi, Pakistan</li>
              <li>+92 3157290168</li>
              <li>owais50@gmail.com</li>
            </ul>
          </div>
        </div>
      </div>

      
      <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
        <p>© {new Date().getFullYear()} Brand. All Rights Reserved.</p>
        <ul className='flex items-center gap-4'>
          <li><a href="#">Privacy</a></li>
          <span>|</span>
          <li><a href="#">Terms</a></li>
          <span>|</span>
          <li><a href="#">Cookies</a></li>
        </ul>
      </div>
    </div>
  )
}

export default Footer
