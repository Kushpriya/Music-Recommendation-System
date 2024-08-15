import Signup from './components/Signup'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import Spinner from './components/Spinner'
import ProtecedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import { useSelector } from 'react-redux'
import { Toaster } from "react-hot-toast"
import CreatePlaylist from './components/CreatePlaylist'
import AdminHome from './pages/admin/AdminHome'
import AddEditSong from './pages/admin/AddEditSong'
import AllUsers from './pages/admin/AllUsers'
import DeleteEditUser from './pages/admin/DeleteUser'


function App() {
  const { loading } = useSelector((state) => state.alerts)
  // const [count, setCount] = useState(0)


  return (
    <div className='App'>
      {loading && <Spinner />}
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtecedRoute> <Home /> </ProtecedRoute>} ></Route>
          <Route path="/register" element={<PublicRoute> <Signup /> </PublicRoute>}> </Route>
          <Route path="/login" element={<PublicRoute> <Login /> </PublicRoute>} ></Route>
          <Route path="/create-edit-playlist" element={<ProtecedRoute><CreatePlaylist /></ProtecedRoute>}></Route>
          <Route path="/admin" element={<ProtecedRoute><AdminHome /></ProtecedRoute>}></Route>
          <Route path="/admin/add-edit-song" element={<ProtecedRoute><AddEditSong /></ProtecedRoute>}></Route>
          <Route path="/admin/user" element={<ProtecedRoute><AllUsers /></ProtecedRoute>}></Route>
          <Route path="/admin/delete-user" element={<ProtecedRoute><DeleteEditUser /></ProtecedRoute>}></Route>

         </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
