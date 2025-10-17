import { Footer, NavBar } from '@/components'
import {
  Features,
  Hero,
  HowItWorks,
  Problems,
  Solutions,
  WhyBase
} from '@/section'

const Home = () => {
  return (
    <>
      <NavBar />

      <div className='relative'>
        <div
          className={
            'absolute inset-0 bg-gradient-to-tr from-[#0052FF]/20 to-[#0052FF]/40 z-[-1] via-white/80 dark:via-black/80 '
          }
        />
        <Hero />
      </div>

      <Problems />
      <Solutions />
      <Features />
      <HowItWorks />
      <WhyBase />
      <Footer />
    </>
  )
}

export default Home
