'use client'
import { Phone } from '@/components/Phone'
import { NavBar, Footer } from '@/components'

export default function USSDInterface () {
  return (
    <>
      <NavBar />
      <div className='flex items-center justify-center min-h-screen bg-muted/30 py-32'>
        <div className='container'>
          <h1 className='text-3xl md:text-4xl font-bold text-center mb-8'>
            Try Our USSD Interface
          </h1>
          <p className='text-center text-muted-foreground max-w-2xl mx-auto mb-12'>
            Experience how Avanomad works on feature phones. Dial a USSD code
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
              USSD functionality. Real USSD services (likeAfrica Talking) are
              prohibitively expensive.
            </p>
            <p className='text-sm text-gray-700 dark:text-gray-300'>
              In a production environment, actual USSD gateways to provide this
              service to users without smartphones or internet access will be
              used.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
