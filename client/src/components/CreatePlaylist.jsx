import axios from 'axios';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HideLoading, ShowLoading } from '../redux/alertSlice';
import { SetSelectedPlaylist, SetSelectedPlaylistForEdit, SetUser } from '../redux/userSlice';
import Player from './Player';
import { IoArrowBackSharp } from "react-icons/io5";

function CreatePlaylist() {
    const [name, setName] = React.useState("")
    const [selectedSongs, setSelectedSongs] = React.useState([])
    const { allSongs, selectedPlaylistForEdit } = useSelector((state) => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const onSave = () => {
        if (name.trim().length === 0 || selectedSongs.lenght === 0) {
            toast.error("Please fill all the field")
        }
        else {
            dispatch(ShowLoading())
            axios.post('http://localhost:3001/api/songs/add-playlist', {
                name,
                songs: selectedSongs,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then((result) => {
                    dispatch(HideLoading())
                    if (result.data.success) {
                        toast.success("Playlist created successfullly")
                        dispatch(SetUser(result.data.data))
                        setName("")
                        setSelectedSongs([])
                        navigate('/')
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
    }

    const onEdit = () => {
        if (name.trim().length === 0 || selectedSongs.lenght === 0) {
            toast.error("Please fill all the field")
        }
        else {
            dispatch(ShowLoading())
            axios.post('http://localhost:3001/api/songs/update-playlist', {
                name,
                songs: selectedSongs,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then((result) => {
                    dispatch(HideLoading())
                    if (result.data.success) {
                        toast.success("Playlist created successfullly")
                        dispatch(SetUser(result.data.data))
                        dispatch(SetSelectedPlaylistForEdit(null))
                        dispatch(SetSelectedPlaylist({
                            name: "All Songs",
                            songs: allSongs,
                        }))
                        setName("")
                        setSelectedSongs([])
                        navigate('/')
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
    }

    const selectUnselectSong = (song) => {

        if (selectedSongs.find((s) => s._id === song._id)) {
            setSelectedSongs(selectedSongs.filter((s) => s._id !== song._id))
        }
        else {
            setSelectedSongs([...selectedSongs, song])
        }
    }
    useEffect(() => {
        if (selectedPlaylistForEdit) {
            setName(selectedPlaylistForEdit.name);
            setSelectedSongs(selectedPlaylistForEdit.songs)
        }
    }, [])
    return (
        <div>
            <div className="flex items-center gap-5">
                <i className="text-3xl cursor-pointer" onClick={() => {
                    navigate('/ ')
                }}><IoArrowBackSharp /></i>
                <h1 className="text-3xl">Create Playlist</h1>
            </div>
            <div className='flex justify-between gap-3 mt-5'>
                <input className="w-96" type="text" placeholder='Name'
                disabled ={selectedPlaylistForEdit}
                value={name}
                onChange={(e) => {
                    setName(e.target.value)
                }} />
                <button className='bg-orange-500 text-white py-2 px-5' onClick={()=>{
                    if(selectedPlaylistForEdit){
                        onEdit()
                    }
                    else{
                        onSave()
                    }
                }}>SAVE</button>
            </div>
            <h1 className='my-5 text-2xl'>Selected Songs - {selectedSongs.length}</h1>
            <div className=''>
            <div className="grid grid-cols-3 gap-3 overflow-y-scroll h-[35vh] p-3 ">
                {allSongs.map((song, index) => {
                    const isSelected = selectedSongs.find((s) => s._id === song._id)
                    return (
                        <div className={`p-2 flex item-center justify-between border cursor-pointer 
                ${isSelected && ' border-active border-2'}`} onClick={() => {
                                selectUnselectSong(song)
                            }} key={index}>
                            <div>
                                <h1>{song.title} </h1>
                                <h1>
                                    {song.artist} - {song.album} - {song.year}
                                </h1 >
                            </div>
                        </div>
                    );
                })}
            </div>
            </div>
            <Player />
        </div>
    );
}
export default CreatePlaylist;