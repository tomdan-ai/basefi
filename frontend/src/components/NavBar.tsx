import { MenuIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/constant'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import DarkModeToggle from './DarkModeToggle'

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.pageYOffset > 200)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
    // to prevent scrolling when menu is open
    if (!menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }

  // Handle logo click - navigate to home
  const handleLogoClick = () => {
    navigate('/')
  }

  // Handle navigation link clicks
  const handleNavClick = (url: string) => {
    // If it's a hash link and we're not on home page, navigate to home first
    if (url.startsWith('#')) {
      if (location.pathname !== '/') {
        // Navigate to home page with the hash
        navigate(`/${url}`)
      } else {
        // Already on home page, just scroll to section
        const element = document.querySelector(url)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    } else {
      // Regular navigation
      navigate(url)
    }

    // Close mobile menu if open
    if (menuOpen) {
      toggleMenu()
    }
  }

  return (
    <header
      className={` ${
        scrolled
          ? '/bg-white/80 dark:bg-gray-900/80 shadow-sm backdrop-blur-lg'
          : '!bg-transparent'
      } z-50 fixed mx-auto px-4 md:py-3 w-full flex items-center justify-between top-0 transition-all duration-300 md:px-10 lg:px-20 text-white`}
    >
      {/* Clickable Logo - navigates to home */}
      <button
        onClick={handleLogoClick}
        className='cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded'
        aria-label='Go to home page'
      >
        <img
          src='/basefi.png'
          alt='BaseFi Logo'
          className='h-20 w-auto z-50 hover:opacity-80 transition-opacity'
        />
      </button>

      <nav className='hidden md:flex items-center gap-6'>
        {NAV_LINKS.map(link => (
          <button
            key={link.name}
            onClick={() => handleNavClick(link.url)}
            className={cn(
              'font-medium transition-colors hover:text-blue-500 text-xl uppercase cursor-pointer',
              scrolled
                ? 'text-gray-700 dark:text-gray-300'
                : 'dark:text-white text-black'
            )}
          >
            {link.name}
          </button>
        ))}
        <DarkModeToggle
          className={
            scrolled
              ? 'text-gray-700 dark:text-gray-300'
              : 'dark:text-white text-black'
          }
        />
      </nav>

      <div className='flex md:hidden gap-3'>
        <DarkModeToggle />
        <button
          className={cn(
            ' cursor-pointer p-0',
            scrolled
              ? 'text-black dark:text-white'
              : 'text-black dark:text-white'
          )}
          onClick={toggleMenu}
        >
          <MenuIcon size={27} />
          <span className='sr-only'>Open menu</span>
        </button>{' '}
      </div>
      <nav
        className={`fixed md:hidden top-0 left-0 w-full h-screen bg-background text-gray-700 dark:text-gray-300 z-50 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='p-5'>
          <div className='flex justify-between items-center mb-10'>
            <button
              onClick={handleLogoClick}
              className='cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded'
              aria-label='Go to home page'
            >
              <img
                src='/basefi.png'
                alt='BaseFi Logo'
                className='h-10 w-auto hover:opacity-80 transition-opacity'
              />
            </button>

            <button
              className='cursor-pointer p-2 hover:bg-gray-600 dark:hover:bg-gray-200 rounded-full'
              onClick={toggleMenu}
              aria-label='Close menu'
            >
              <X size={24} className='hover:text-white dark:hover:text-black' />
            </button>
          </div>{' '}
          <div className='flex flex-col gap-6 mt-8'>
            {NAV_LINKS.map(link => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.url)}
                className={cn(
                  'font-medium transition-colors text-xl py-2 border-b border-border text-left cursor-pointer hover:text-blue-500'
                )}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default NavBar
