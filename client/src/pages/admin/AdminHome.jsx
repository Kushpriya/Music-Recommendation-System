import React, { useEffect } from 'react';
import { useSelector } from 'react-redux'
import { MdEdit } from "react-icons/md";

import { useNavigate } from 'react-router-dom';
function AdminHome() {
    const [selectedSongForEdit, SetSelectedPlaylistForEdit] = React.useState(null)
    const { allSongs, user } = useSelector(state => state.user)
    const navigate = useNavigate()

    useEffect (() =>{
        if(user)
        if(user?.admin && !user.isAdmin || !user?.isAdmin){
            navigate("/")
        }
    },[])

    return (
        <div className='overflow-y-scroll h-[78vh]'>
            <div className="flex justify-between">
            <h1 className="text-3xl text-gray-700">All Songs</h1>
            <button className='text-white bg-orange-500 py-2 px-5' onClick={()=>{
                navigate("/admin/add-edit-song")
            }}>Add Song</button>
            </div>
            <table className='w-full mt-5'>
                <thead className='w-full'>
                    <tr>
                        <th>Title</th>
                        <th>Artist</th>
                        <th>Album</th>
                        <th>Year</th>
                        <th>Duration</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {allSongs && allSongs.length > 0 ? (
                    allSongs.map((song, index) => (
                        <tr  key={`${song.id}-${index}`}>
                            <td>{song.title}</td>
                            <td>{song.artist}</td>
                            <td>{song.album}</td>
                            <td>{song.year}</td>
                            <td>{song.duration}</td>
                            <td>
                            <i className='text-2xl text-gray-500' onClick={() => {
                                    navigate("/admin/add-edit-song/?id=" + song._id)
                                }}><MdEdit/></i>
                            </td>
                        </tr>
                        ))): (
                            <tr>
                              <td colSpan="6">No songs available</td>
                            </tr> )}

                </tbody>
            </table>
        </div>
    );
}

export default AdminHome;