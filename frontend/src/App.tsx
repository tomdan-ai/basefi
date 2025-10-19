import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom'
import Home from './pages/Home'
import USSDInterface from './pages/USSDInterface'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'

// Component to handle hash navigation
const HashScrollHandler = () => {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      // Small delay to ensure the page has loaded
      setTimeout(() => {
        const element = document.querySelector(location.hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }, [location])

  return null
}

function App () {
  useEffect(() => {
    AOS.init()
  }, [])

  return (
    <Router>
      <HashScrollHandler />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/ussd-interface' element={<USSDInterface />} />

        {/* Fallback route for 404 handling */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </Router>
  )
}

export default App
