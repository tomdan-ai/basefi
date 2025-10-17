import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface PhoneNumberDialogProps {
  isOpen: boolean
  onClose: (phoneNumber?: string) => void
  defaultValue?: string
  setInput?: (value: string) => void
}

export function PhoneNumberDialog ({
  isOpen,
  onClose,
  defaultValue = '07012345678',
  setInput
}: PhoneNumberDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState(defaultValue)
  const [error, setError] = useState('')

  // Handle the escape key to close the dialog
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
    }

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleSubmit = () => {
    // Basic validation
    if (!phoneNumber || phoneNumber.length < 10 || isNaN(Number(phoneNumber))) {
      setError('Please enter a valid phone number')
      return
    }

    onClose(phoneNumber)
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div
        className='bg-white dark:bg-gray-800 rounded-lg p-6 w-[90%] max-w-md shadow-xl'
        onClick={e => e.stopPropagation()}
      >
        <h2 className='text-xl font-bold mb-4'>Phone Number</h2>
        <p className='text-gray-600 dark:text-gray-300 mb-4'>
          Enter your phone number to use the USSD service:
        </p>

        <div className='mb-4'>
          <input
            type='tel'
            value={phoneNumber}
            onChange={e => {
              setInput?.('')
              setPhoneNumber(e.target.value)
              setError('')
            }}
            placeholder='Enter phone number'
            className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            autoFocus
          />
          {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
        </div>

        <div className='flex justify-end space-x-3'>
          <Button variant='outline' onClick={() => onClose()}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Continue</Button>
        </div>
      </div>
    </div>
  )
}
