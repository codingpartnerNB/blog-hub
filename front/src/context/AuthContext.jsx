import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const { data } = await axios.get(`/api/users/profile`);
          setUser({
            ...data,
            profileImage: data.profileImage // Construct full URL
          });
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    }
    
    checkLoggedIn()
  }, [])

  const register = async (userData) => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('name', userData.name)
      formData.append('email', userData.email)
      formData.append('password', userData.password)
      if (userData.profileImage) {
        formData.append('profileImage', userData.profileImage)
      }

      console.log('Registering user with data:', userData); // Debugging log

      // Debugging: Log FormData contents
      console.log('Registering user with the following data:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const { data } = await axios.post(`/api/users/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      localStorage.setItem('token', data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      setUser(data.user)
      toast.success('Registration successful!')
      navigate('/dashboard')
      return data
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      const { data } = await axios.post(`/api/users/login`, { email, password })
      localStorage.setItem('token', data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      setUser(data.user)
      toast.success('Login successful!')
      navigate('/dashboard')
      return data
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid credentials'
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}