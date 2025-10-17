import { Footer, NavBar } from '@/components'
import {
  Features,
  Hero,
  HowItWorks,
  Problems,
  Solutions,
  WhyAvalanche
} from '@/section'

const Home = () => {
  return (
    <>
      <NavBar />

      <div className='relative'>
        <div
          className={
            'absolute inset-0 bg-gradient-to-tr from-primary-red to-primary-blue z-[-1] via-white/80 dark:via-black/80 '
          }
        />
        <Hero />
      </div>

      <Problems />
      <Solutions />
      <Features />
      <HowItWorks />
      <WhyAvalanche />
      <Footer />
    </>
  )
}

export default Home
