'use client'
import { Phone } from '@/components/Phone'
import { NavBar, Footer } from '@/components'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function USSDInterface () {
  const navigate = useNavigate()

  return (
    <>
      <NavBar />
      <div className='flex items-center justify-center min-h-screen bg-muted/30 py-32'>
        <div className='container'>
          {/* Back to Home Button */}
          <div className='flex justify-center mb-6'>
            <button
              onClick={() => navigate('/')}
              className='inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              <ArrowLeft size={20} />
              Back to Home
            </button>
          </div>

          <h1 className='text-3xl md:text-4xl font-bold text-center mb-8'>
            Try Our USSD Interface
          </h1>
          <p className='text-center text-muted-foreground max-w-2xl mx-auto mb-12'>
            Experience how BaseFi works on feature phones. Dial a USSD code
            (try *123#) to simulate the service.
          </p>
          <div className='flex items-center justify-center'>
            <Phone />
          </div>

          <div className='mt-6 p-4 bg-gray-100 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 rounded-lg max-w-md mx-auto'>
            <p className='mb-2'>
              <span className='font-bold text-yellow-700 dark:text-yellow-400'>
                NOTE:
              </span>
            </p>
            <p className='text-sm text-gray-700 dark:text-gray-300 mb-2'>
              This is a <span className='font-semibold'>simulation</span> of
              USSD functionality. Real USSD services (like Africa Talking) are
              prohibitively expensive.
            </p>
            <p className='text-sm text-gray-700 dark:text-gray-300'>
              In a production environment, actual USSD gateways to provide this
              service to users without smartphones or internet access will be
              used.
            </p>
          </div>

          {/* Navigation Helper */}
          <div className='mt-8 text-center'>
            <p className='text-sm text-muted-foreground mb-4'>
              Want to learn more about how it works?
            </p>
            <div className='flex flex-wrap justify-center gap-4'>
              <button
                onClick={() => navigate('/#how-it-works')}
                className='px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg transition-colors duration-200'
              >
                How It Works
              </button>
              <button
                onClick={() => navigate('/#features')}
                className='px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg transition-colors duration-200'
              >
                Features
              </button>
              <button
                onClick={() => navigate('/#why-base')}
                className='px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg transition-colors duration-200'
              >
                Why Base
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
