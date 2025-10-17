import { MenuIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/constant'
import { useState, useEffect } from 'react'
import DarkModeToggle from './DarkModeToggle'

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    window.addEventListener('scroll', () =>
      setScrolled(window.pageYOffset > 200)
    )

    return () => {
      window.removeEventListener('scroll', () =>
        setScrolled(window.pageYOffset > 200)
      )
    }
  }, [])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
    // to revent scrolling when menu is open
    if (!menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
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
      {/* Logo Light Mode */}
      <img
        src={scrolled ? '/logo-black.png' : '/logo-black.png'}
        alt='BaseFi Logo'
        className='h-20 w-auto block dark:hidden z-50 '
      />
      {/* Logo for Dark Mode */}
      <img
        src={scrolled ? '/logo-white.png' : '/logo-white.png'}
        alt='BaseFi Logo'
        className='h-20 w-auto dark:block hidden z-50'
      />
      <nav className='hidden md:flex items-center gap-6'>
        {NAV_LINKS.map(link => (
          <a
            key={link.name}
            href={link.url}
            className={cn(
              'font-medium transition-colors hover:text-black text-xl uppercase',
              scrolled
                ? 'text-gray-700 dark:text-gray-300'
                : 'dark:text-white text-black'
            )}
          >
            {link.name}
          </a>
        ))}
        <DarkModeToggle
          className={
            scrolled
              ? 'text-gray-700 dark:text-gray-300'
              : 'dark:text-white text-black'
          }
        />
        {/* <Button
          asChild
          variant='outline'
          className={cn(
            'transition-colors',
            'bg-black/10 text-black border-black/20 hover:bg-black/20'
          )}
        >
          <a href='#waitlist'>Join Waitlist</a>
        </Button> */}
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
            <img
              src='/logo-white.png'
              alt='BaseFi Logo'
              className='h-10 w-auto hidden dark:block'
            />
            <img
              src='/logo-black.png'
              alt='BaseFi Logo'
              className='h-10 w-auto block dark:hidden'
            />

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
              <a
                key={link.name}
                href={link.url}
                onClick={toggleMenu}
                className={cn(
                  'font-medium transition-colors  text-xl py-2 border-b border-border'
                )}
              >
                {link.name}
              </a>
            ))}

            {/* <Button asChild className='mt-6'>
              <a href='#waitlist' onClick={toggleMenu}>
                Join Waitlist
              </a>
            </Button> */}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default NavBar
