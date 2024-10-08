import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import About from './pages/About'
import PastEvents from './pages/PastEvents'
import Events from './pages/Events'
import FooterBar from './pages/Footer'
function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path='/login' element={<Login />} />      
    </Routes>
      <About/>
      <Events/>
      <PastEvents />
      <FooterBar />
    </>
  )
}

export default App

