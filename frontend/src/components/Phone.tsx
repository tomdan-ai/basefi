'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { processUSSD, clearUSSDSession } from '@/services/ussdService'
import { PhoneNumberDialog } from '@/components/'
import { BarChart, BatteryMediumIcon, Clock, Mail } from 'lucide-react'

export function Phone () {
  const [input, setInput] = useState('')
  const [displayText, setDisplayText] = useState('Enter USSD code')
  const [isProcessing, setIsProcessing] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [ussdText, setUssdText] = useState('')
  const [showPhoneDialog, setShowPhoneDialog] = useState(false)
  const inputRef = useRef<HTMLDivElement>(null)

  // Check for saved phone number on first load
  useEffect(() => {
    const savedPhone = localStorage.getItem('ussd_phone_number')
    if (savedPhone) {
      setPhoneNumber(savedPhone)
    } else {
      setShowPhoneDialog(true)
    }
  }, [])

  // Handle dialog close and phone number submission
  const handlePhoneDialogClose = (phone?: string) => {
    if (phone) {
      setPhoneNumber(phone)
      localStorage.setItem('ussd_phone_number', phone)
    }
    setShowPhoneDialog(false)
  }

  // Handle button press
  const handleButtonPress = (value: string) => {
    if (isProcessing) return

    if (value === 'call') {
      handleCall()
    } else if (value === 'clear') {
      if (input.length === 0) {
        // Reset session on clear when input is empty
        clearUSSDSession()
        setUssdText('')
        setDisplayText('Enter USSD code')
      } else {
        setInput(prev => prev.slice(0, -1))
      }
    } else {
      setInput(prev => prev + value)
    }
  }

  // Handle call/send
  const handleCall = async () => {
    if (input.length === 0 || !phoneNumber) return

    setIsProcessing(true)
    setDisplayText(`Dialing ${input}...`)

    try {
      // Determine if this is initial code or a response
      let textToSend = input
      if (input.startsWith('*') && input.endsWith('#')) {
        // This is a new USSD code - reset the session text
        setUssdText('')
        textToSend = ''
      } else if (ussdText) {
        // This is a response to an existing session
        textToSend = ussdText ? `${ussdText}*${input}` : input
      }

      // Update the cumulative USSD text
      if (ussdText && input) {
        setUssdText(prev => `${prev}*${input}`)
      } else if (input.startsWith('*') && input.endsWith('#')) {
        // Start of new session with a USSD code
        setUssdText('')
      } else {
        setUssdText(input)
      }

      // Process the USSD request
      const response = await processUSSD(phoneNumber, textToSend)

      // Display the response
      setDisplayText(response.replace(/^(CON|END)\s/, ''))

      // Clear input only if the session continues
      if (response.startsWith('CON')) {
        setInput('')
      } else {
        // Session ended, reset everything
        setInput('')
        setUssdText('')
      }
    } catch (error) {
      console.error('Error processing USSD request:', error)
      setDisplayText('Connection error. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleButtonPress(e.key)
      } else if (e.key === '*') {
        handleButtonPress('*')
      } else if (e.key === '#') {
        handleButtonPress('#')
      } else if (e.key === 'Enter') {
        handleCall()
      } else if (e.key === 'Backspace') {
        handleButtonPress('clear')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [input, isProcessing])

  // Focus the phone when clicked
  const focusPhone = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Render screen content
  const renderScreen = () => {
    if (isProcessing) {
      return <div className='text-center animate-pulse'>Processing...</div>
    }

    return <div className='whitespace-pre-wrap'>{displayText}</div>
  }
  return (
    <>
      <div
        className='relative w-[300px] h-[600px] bg-gray-300 dark:bg-gray-800 rounded-[40px] shadow-xl p-6 flex flex-col border border-gray-500'
        onClick={focusPhone}
        tabIndex={0}
        ref={inputRef}
      >
        {/* Phone top section with speaker */}
        <div className='w-16 h-1 bg-gray-500 rounded-full mx-auto mb-4'></div>

        {/* Screen */}
        <div className='bg-[#a4c0a0] border-3 border-gray-500 rounded-lg p-3 /mb-6 h-[180px] flex flex-col'>
          <div className='text-xs text-gray-700 mb-1 flex justify-between'>
            <div className='flex gap-1 items-center '>
              <span className='relative'>
                <BarChart className='h-4 w-4 ml-[1px] ' />
                <p className='absolute top-0 text-[8px]'>1</p>
              </span>

              <span className='relative'>
                <BarChart className='h-4 w-4 ml-[1px] ' />
                <p className='absolute top-0 text-[8px]'>2</p>
              </span>
            </div>
            <div className='flex gap-2 items-center'>
              <Mail className='h-4 w-4 ' />
              <Clock className='h-4 w-4 ' />
              <BatteryMediumIcon className='h-5 w-5 ' />
            </div>
          </div>

          <div className='flex-1 flex flex-col'>
            <div className='text-black font-mono text-sm whitespace-pre-line flex-1'>
              {renderScreen()}
            </div>
            <div className='text-black font-mono text-lg mt-2'>{input}</div>
          </div>
        </div>

        <h4 className='text-center my-3'>NOKIA</h4>

        {/* Navigation buttons */}
        <div className='grid grid-cols-3 gap-2 mb-4 '>
          <Button
            variant='outline'
            className='bg-gray-400 hover:bg-gray-500 h-12 rounded-md'
            onClick={() => handleButtonPress('clear')}
          >
            Clear
          </Button>
          <Button
            variant='outline'
            className='bg-gray-400 hover:bg-gray-500 h-12 rounded-md col-span-2'
            onClick={() => handleCall()}
          >
            Dial
          </Button>
        </div>

        {/* Keypad */}
        <div className='grid grid-cols-3 gap-4'>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map(num => (
            <Button
              key={num}
              variant='outline'
              className='bg-gray-200 hover:bg-gray-300 h-14 text-xl font-bold rounded-full'
              onClick={() => handleButtonPress(num.toString())}
            >
              {num}
              {num === 1 && <div className='text-[8px] mt-1'></div>}
              {num === 2 && <div className='text-[8px] mt-1'>ABC</div>}
              {num === 3 && <div className='text-[8px] mt-1'>DEF</div>}
              {num === 4 && <div className='text-[8px] mt-1'>GHI</div>}
              {num === 5 && <div className='text-[8px] mt-1'>JKL</div>}
              {num === 6 && <div className='text-[8px] mt-1'>MNO</div>}
              {num === 7 && <div className='text-[8px] mt-1'>PQRS</div>}
              {num === 8 && <div className='text-[8px] mt-1'>TUV</div>}
              {num === 9 && <div className='text-[8px] mt-1'>WXYZ</div>}
            </Button>
          ))}
        </div>

        {/* Bottom connection status */}
        <div className='text-xs text-center mt-1'>
          {phoneNumber ? (
            <span className='text-green-600'>
              Connected as: {phoneNumber.substring(0, 4)}***
              {phoneNumber.substring(phoneNumber.length - 2)}
            </span>
          ) : (
            <span className='text-red-600'>Not connected</span>
          )}
        </div>

        {/* Reset session button */}
        <Button
          variant={'destructive'}
          className='text-xs mt-2 p-1 dark:bg-red-500 text-white rounded'
          onClick={() => {
            clearUSSDSession()
            setUssdText('')
            setDisplayText('Enter USSD code')
            setInput('')
          }}
        >
          Reset Session
        </Button>

        {/* Change phone number button */}
        {/* <Button
          variant='outline'
          className='text-xs mt-2 p-1 text-blue-500 rounded'
          onClick={() => setShowPhoneDialog(true)}
        >
          Change Phone Number
        </Button> */}
      </div>{' '}
      {/* Phone Number Dialog */}
      <PhoneNumberDialog
        isOpen={showPhoneDialog}
        onClose={handlePhoneDialogClose}
        defaultValue={phoneNumber || '07012345678'}
        setInput={setInput}
      />
    </>
  )
}
