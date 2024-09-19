import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import About from './pages/About'
function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path='/login' element={<Login />} />
    </Routes>
      <About/>
    </>
  )
}

export default App
