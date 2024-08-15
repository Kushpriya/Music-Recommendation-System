import axios from 'axios';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
function AdminHome() {
    const [allUsers, setAllUsers] = React.useState(null)

    const { allSongs, user } = useSelector(state => state.user)
    const navigate = useNavigate()
    const disable = null;

    const onDelete = (id, name) => {
        Promise.resolve()
            .then(() => {
                const userConfirmed = window.prompt(`to delete write  ${name}`)
                

                if (!userConfirmed) {
                    // User cancelled the delete operation
                    toast.error("User deletion cancelled.")
                    throw new Error('User deletion cancelled.');
                }
                else if(userConfirmed !== name){
                    toast.error('Incorrect! delection cancelled.')
                    throw new Error('Incorrect! delection cancelled.')
                }

                // User confirmed, proceed with the delete operation
                return new Promise((resolve) => {
                    // Simulating an asynchronous operation with setTimeout
                    axios.delete(`http://localhost:3001/api/admin/delete-user/${id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                    .then(() => {
                        // Handle success
                        toast.success('User deleted successfully!')
                        window.location.reload()
                        
                    })
                    .catch((error) => {
                        // Handle errors or cancellation
                        console.error(error);
                        toast.error(error.message || 'Error deleting user.');
                    })
                });
            })
            
    }

    useEffect(() => {
        if (user)
            if (user?.admin && !user.isAdmin || !user?.isAdmin) {
                navigate("/")
            }
    }, [])
    useEffect(() => {
        axios.post('http://localhost:3001/api/users/get-all-users', {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
        })
            .then((result) => {
                setAllUsers(result.data.data)
                console.log(result.data.data)

            })
            .catch((err) => {
                console.log(err)
            })

    }, [])

    return (
        <div >
            <div className="flex justify-between">
                <h1 className="text-3xl text-gray-700">All Users</h1>
            </div>
            <div className='overflow-y-scroll h-[70vh]'>

                <table className='w-full mt-5'>
                    <thead className='w-full'>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Playlist</th>
                            <th>isAdmin</th>
                            <th colSpan='2' >Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers && allUsers.length > 0 ? (
                            allUsers.map((user, index) => (
                                <tr key={`${user.id}-${index}`}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.playlists?.length}</td>
                                    <td>{String(user.isAdmin ? "Yes" : "No")}</td>
                                    {user.isAdmin ? null : <td>
                                        <i className='text-2xl text-red-600' onClick={() => {
                                            onDelete(user._id, user.name)
                                        }}> <MdDelete /></i>
                                    </td>

                                    }

                                </tr>
                            ))) : (
                            <tr>
                                <td colSpan="4">No user available</td>
                            </tr>)}

                    </tbody>
                </table>
            </div>

        </div>
    );


}
export default AdminHome;