const Footer = () => {
  return (
    <footer className='w-full bg-muted/30 py-8'>
      <img
        src='/basefi.png'
        alt='BaseFi Logo'
        className='h-20 mb-4 mx-auto w-auto'
      />
      <p className='text-center text-sm text-muted-foreground'>
        &copy; {new Date().getFullYear()} BaseFi. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
