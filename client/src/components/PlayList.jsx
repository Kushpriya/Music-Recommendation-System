import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SetSelectedPlaylist, SetSelectedPlaylistForEdit, SetUser } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HideLoading, ShowLoading } from '../redux/alertSlice';
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

import axios from 'axios';

function PlayList() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user, allSongs, selectedPlaylist } = useSelector((state) => state.user)
    const allPlaylists = [{
        name: 'All Songs',
        songs: allSongs
    }, ...user.playlists]
    

    const onDelete = (name) => {
        dispatch(ShowLoading())
        axios.post('http://localhost:3001/api/songs/delete-playlist', {
            name,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((result) => {
                dispatch(HideLoading())
                if (result.data.success) {
                    toast.success("Playlist deleted successfullly")
                    dispatch(SetSelectedPlaylist({
                        name: "All Songs",
                        songs: allSongs,
                    }))
                    dispatch(SetUser(result.data.data))
                }
                else {
                    dispatch(HideLoading())
                    toast.error(result.data.message)
                }
            })
            .catch((err) => {
                dispatch(HideLoading())
                toast.error("something went worng")
            })
    }
    useEffect(() => {
        if (!selectedPlaylist && allSongs?.length > 0) {
            dispatch(SetSelectedPlaylist(allPlaylists[0]))
        }
    }, [selectedPlaylist, allSongs])
    return (
        <div>
            <div className="flex justify-between w-full">
                <h1 className='text-secondary text-2xl'>Your Playlists</h1>
                <h1 className="underline cursor-pointer text-xl text-secondary" onClick={() => {
                    navigate("/create-edit-playlist")
                }}>Create Playlist</h1>
            </div>
            <div className="flex flex-row gap-3 mt-10 overflow-x-scroll w-full ">
                {allPlaylists?.map((Playlist, index) => {
                    const isSelected = Playlist?.name === selectedPlaylist?.name
                    return (
                        <div className={`grid grid-cols-auto gap-1 shadow border rounded p-2  cursor-pointer ${isSelected && 'border-active border-2'}`}
                            onClick={() => {
                                dispatch(SetSelectedPlaylist(Playlist))
                            }} key={index}>
                            <h1 className='text-2xl text-gray-700'>{Playlist?.name}</h1>
                            <h1 className='text-xl'>{Playlist?.songs?.length } Songs</h1>
                            
                            {  Playlist?.name === "All Songs" ?( <div className='flex gap-3 justify-between'>
                                
                            </div>) : (
                               
                                <div>
                                <hr /> 
                                <div className='flex gap-3 justify-between'>
                                <div className='text-2xl text-red-500' onClick={() => {
                                    onDelete(Playlist.name)
                                }}><MdDelete /></div>
                                <i className='text-2xl text-gray-500' onClick={() => {
                                    dispatch(SetSelectedPlaylistForEdit(Playlist))
                                    navigate(`/create-edit-playlist`)
                                }}>< MdEdit /></i>
                            </div>
                            </div>
                            )}

                            
                           
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default PlayList;