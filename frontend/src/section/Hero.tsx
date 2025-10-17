import { Button } from '@/components/ui/button'

const Hero = () => {
  return (
    <section
      id='hero'
      className={
        'min-h-screen w-full max-w-full flex items-center relative'
      }
      data-aos='zoom-in-up'
    >
      <div className='container mx-auto px-4 py-12 md:py-24 text-center'>
        {' '}
        <h1
          className={
            'text-4xl md:text-5xl lg:text-6xl font-[900] max-w-4xl mx-auto leading-tight text-black dark:text-white'
          }
        >
          Crypto Access for Everyone — Even Without Internet
        </h1>
        <p
          className={
            'mt-6 text-xl md:text-2xl max-w-2xl mx-auto text-gray-700 dark:text-gray-300 font-light'
          }
        >
          Dial a code. Swap fiat ↔ crypto. Powered by Avalanche.
        </p>
        <div className='mt-10 flex flex-col sm:flex-row gap-4 justify-center'>
          {/* <Button
            asChild
            size='lg'
            className={'bg-primary text-white hover:bg-primary/90'
            }
          >
            <a href='#waitlist'>
              Join the Waitlist
            </a>
          </Button> */}
          
          {/* Add new "TRY IT OUT" button */}
          <Button
            asChild
            size='lg'
            className='bg-primary-blue text-white hover:bg-primary-blue/90'
          >
            <a href='/ussd-interface'>
              TRY IT OUT
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Hero
