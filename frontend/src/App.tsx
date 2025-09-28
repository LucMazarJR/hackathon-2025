import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Welcome from './pages/Welcome'
import Auth from './pages/Auth'
import Login from './pages/Login'
import Register from './pages/Register'
import User from './pages/User'
import Calendar from './pages/Calendar'
import Chat from './pages/Chat'
import NotFound from './pages/NotFound'
import { UserProvider } from './contexts/UserContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            // amazonq-ignore-next-line
            <Route path='/user' element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            } />
            <Route path='/calendar' element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            } />
            <Route path='/chat' element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } />
          </Route>
          <Route path='/welcome' element={<Welcome />} />
          <Route path='/auth' element={<Auth />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App