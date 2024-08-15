import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileUploader } from 'react-drag-drop-files'
import { useDispatch, useSelector } from 'react-redux';
import { HideLoading, ShowLoading } from '../../redux/alertSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import { SetAllSongs } from '../../redux/userSlice';
import { IoArrowBackSharp } from "react-icons/io5";


function AddEditSong() {
    const urlParams = new URLSearchParams(window.location.search);
    const songId = urlParams.get("id");
    const { allSongs, user } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const fileTypes = ["mp3"];
    const navigate = useNavigate()
    const [song, setSong] = React.useState({
        title: "",
        artist: "",
        album: "",
        year: "",
        duration: "",
        lyrics: "",
        file: "",
    })



    const handleChange = (file) => {
        setSong({ ...song, file: file });
        console.log(file)
    };

    const onAdd = () => {
        dispatch(ShowLoading())
        const formData = new FormData();
        Object.keys(song).forEach((key) => {
            formData.append(key, song[key])
        })
        axios.post('http://localhost:3001/api/admin/add-song', formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((result) => {
                dispatch(HideLoading())
                if (result.data.success) {
                    const response = fetch('http://127.0.0.1:7777/addedNewSong', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }).then(response => {
                        if (response.ok) {
                            toast.success("Song updated successfullly")
                            dispatch(SetAllSongs(result.data.data))
                            navigate('/admin')
                        } else {
                            toast.error("failed to update song")
                        }
                    })
                        .catch(error => console.error('Error submitting form:', error))
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
        if (user)
            if (user?.admin && !user.isAdmin || !user?.isAdmin) {
                navigate("/")
            }
    }, [])



    const onEdit = () => {
        dispatch(ShowLoading())
        const formData = new FormData();
        Object.keys(song).forEach((key) => {
            formData.append(key, song[key])
        })
        formData.append("_id", songId)
        axios.post('http://localhost:3001/api/admin/edit-song', formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((result) => {
                dispatch(HideLoading())
                if (result.data.success) {
                    const response = fetch('http://127.0.0.1:7777/addedNewSong', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }).then(response => {
                        if (response.ok) {
                            toast.success("Song updated successfullly")
                            dispatch(SetAllSongs(result.data.data))
                            navigate('/admin')
                        } else {
                            toast.error("failed to update song")
                        }
                    })
                        .catch(error => console.error('Error submitting form:', error))
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

        const urlParams = new URLSearchParams(window.location.search)
        if (songId && songId !== "") {
            const existingSong = allSongs.find((s) => s._id === songId);
            setSong(existingSong);
        }

    }, [allSongs])

    return (
        <div>
            <div className="flex items-center gap-5">
                <i className="text-3xl cursor-pointer" onClick={() => {
                    navigate('/admin')
                }}><IoArrowBackSharp /></i>
                <h1 className="text-3xl"> {songId && songId !== "" ? ("Edit Song") : ("Add Song")} </h1>
            </div>
            <div className='flex flex-col gap-3 w-1/3 mt-5'>
                <input type="text" placeholder='Title' value={song.title} onChange={(e) => {
                    setSong({ ...song, title: e.target.value })
                }} />
                <input type="text" placeholder='Artist' value={song.artist} onChange={(e) => {
                    setSong({ ...song, artist: e.target.value })
                }} />
                <input type="text" placeholder='Album' value={song.album} onChange={(e) => {
                    setSong({ ...song, album: e.target.value })
                }} />
                <input type="text" placeholder='Year' value={song.year} onChange={(e) => {
                    setSong({ ...song, year: e.target.value })
                }} />
                <input type="text" placeholder='Duration' value={song.duration} onChange={(e) => {
                    setSong({ ...song, duration: e.target.value })
                }} />
                <textarea id="lyrics" name="lyrics" rows="4" cols="50" placeholder='lyrics' value={song.lyrics} onChange={(e) => {
                    setSong({ ...song, lyrics: e.target.value })
                }} />

                <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
                {song.file && <h1 className='text-gray-500'>{song.file.name}</h1>}
                <div className="flex justify-end">
                    {songId && songId !== "" ? (
                        <button className='text-white bg-orange-500 py-2 px-10 max-w-max'
                            onClick={onEdit}>update</button>
                    ) : (
                        <button className='text-white bg-orange-500 py-2 px-10 max-w-max'
                            onClick={onAdd}>Add</button>
                    )
                    }
                </div>
            </div>
        </div>
    );
}

export default AddEditSong;