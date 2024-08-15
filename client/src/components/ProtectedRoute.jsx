import axios from 'axios'
import react, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { SetAllSongs, SetUser } from '../redux/userSlice'
import { HideLoading, ShowLoading } from '../redux/alertSlice'
import DefaultLayout from './DefaultLayout'

function ProtecedRoute({ children }) {
    const { user } = useSelector(state => state.user)
    const [readyToRender, setReadyToRender] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const getUserData = () => {
        dispatch(ShowLoading())
        axios.post('http://localhost:3001/api/users/get-user-data', {}, {

            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
               dispatch(HideLoading())
                if (response.data.success) {
                    dispatch(SetUser(response.data.data))
                }
                else {
                    alert(response.data.message)
                }
                setReadyToRender(true)
            })
            .catch(err => {
                dispatch(HideLoading())
                navigate('/login')
                localStorage.removeItem('token')
                setReadyToRender(true)
                console.log(err)
            });
    }
    useEffect(() => {
        if (user === null) {
            getUserData()
        }
    }, [])

    const getAllSongs = () => {
        dispatch(ShowLoading())
        axios.post('http://localhost:3001/api/songs/get-all-songs', {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(result => {
                dispatch(SetAllSongs(result.data.data))
                dispatch(HideLoading())
                console.log(result.data)
            })
            .catch(err => {
                dispatch(HideLoading())
                console.log(err)
            })

    }

    useEffect(() => {
        getAllSongs()
    }, [])
    return (
        <div>
            {readyToRender && <DefaultLayout>{children}</DefaultLayout>}
        </div>
    )
}
export default ProtecedRoute;





