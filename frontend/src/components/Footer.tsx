const Footer = () => {
  return (
    <footer className='w-full bg-muted/30 py-8'>
      <img
        src='/logo-white.png'
        alt='BaseFi Logo'
        className='h-20 mb-4 mx-auto w-auto hidden dark:block'
      />
      <img
        src='/logo-black.png'
        alt='BaseFi Logo'
        className='h-20 mb-4 mx-auto w-auto block dark:hidden'
      />
      <p className='text-center text-sm text-muted-foreground'>
        &copy; {new Date().getFullYear()} BaseFi. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
