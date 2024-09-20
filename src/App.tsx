import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import About from './pages/About'
import Events from './pages/Events'
function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path='/login' element={<Login />} />      
    </Routes>
      <About/>
      <Events/>
    </>
  )
}

export default App

