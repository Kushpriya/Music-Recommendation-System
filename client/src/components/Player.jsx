import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SetAllSongs, SetCurrentSong, SetCurrentSongIndex, SetCurrentTime, SetIsPlaying } from '../redux/userSlice';
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp , FaMusic} from "react-icons/fa";
import { FaShuffle } from "react-icons/fa6";
import { BiSkipPrevious, BiSkipNext } from "react-icons/bi";
function Player() {
    const [volume, setvolume] = useState(0.5)
    const [shuffleOn, setShuffleOn] = useState(false)
    const dispatch = useDispatch()
    const audioRef = React.createRef()

    const { currentSong, currentSongIndex, allSongs, isPlaying, currentTime } = useSelector((state) => state.user)
    
    const onPlay = () => {
        audioRef.current.play();
        dispatch(SetIsPlaying(true))
    }

    const onPause = () => {
        audioRef.current.pause()
        dispatch(SetIsPlaying(false))
    }

    const onPrev = () => {
        if (currentSongIndex !== 0 && !shuffleOn) {
            dispatch(SetCurrentSongIndex(currentSongIndex - 1))
            dispatch(SetCurrentSong(allSongs[currentSongIndex - 1]))
        } else {
            const randomIndex = Math.floor(Math.random() * allSongs.length)
            dispatch(SetCurrentSongIndex(randomIndex))
            dispatch(SetCurrentSong(allSongs[randomIndex]))
        }
    }

    const onNext = () => {
        if (currentSongIndex !== allSongs.length - 1 && !shuffleOn) {
            dispatch(SetCurrentSongIndex(currentSongIndex + 1))
            dispatch(SetCurrentSong(allSongs[currentSongIndex + 1]))
        } else {
            const randomIndex = Math.floor(Math.random() * allSongs.length)
            dispatch(SetCurrentSongIndex(randomIndex))
            dispatch(SetCurrentSong(allSongs[randomIndex]))
        }
    }

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.pause()
            audioRef.current.load()
            audioRef.current.play()
        }
    }, [currentSong])

    useEffect(() => {
        if (currentTime) {
            audioRef.current.currentTime = currentTime;
        }
    }, [])

    useEffect(() => {
        if (!currentSong && allSongs.length > 0) {
            dispatch(SetCurrentSong(allSongs[0]))
        }
    }, [allSongs])



    return (

        <div className="absolute bottom-0 left-0 right-0 p-1 shadow-lg bg-white ">
            <div className="flex justify-between items-cente border p-5 border-green-500 rounded shadow-xl">
                <div className='flex items-center gap-5 w-96' >
                    <img className='h-20 w-32' src="\logo.jpg" alt="logo" />
                    <div>
                        <h1 className='text-active text-2xl'>{currentSong?.title}</h1>
                        <h1 className='text-secondary'>{currentSong?.artist}, {currentSong?.album} , {currentSong?.year} </h1>
                    </div>
                </div>
                <div className='w-96 flex flex-col items-center'>
                    <audio src={`http://localhost:3001/api/songs/get-song/${currentSong?.src}`} ref={audioRef} onTimeUpdate={(e) => {
                        dispatch(SetCurrentTime(e.target.currentTime))
                    }}></audio>
                    <div className='flex gap-10' >
                        <i onClick={onPrev} className='cursor-pointer text-4xl text-gray-500'><BiSkipPrevious /></i>
                        {isPlaying ? (
                            <i onClick={onPause} className='cursor-pointer text-4xl '><FaPause /></i>
                        ) : (
                            <i onClick={onPlay} className='cursor-pointer text-4xl '><FaPlay /></i>
                        )}
                        <i onClick={onNext} className='cursor-pointer text-4xl text-gray-500' ><BiSkipNext /> </i>
                    </div>
                    <div className="flex gap-3 items-center w-full">
                        <i className={` text-xl ${shuffleOn && 'text-orange-500 font-semibold'}`} onClick={() => {
                            setShuffleOn(!shuffleOn)
                        }}><FaShuffle /></i>
                        <h1>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60)}</h1>
                       
                        <input type="range" className='p-0 w-full'
                            min={0} max= { String(Number((currentSong?.duration > 1)) ? String(Number(currentSong?.duration) * 60) : String(Number(currentSong?.duration)*100))}
                            value={currentTime}
                            onChange={(e) => {
                                audioRef.current.currentTime = e.target.value;
                                dispatch(SetCurrentTime(e.target.value))
                            }}
                        />
                        <h1>{currentSong?.duration}</h1>
                    </div>
                </div>
                <div className='flex gap-3 items-center'>
                    <i className='text-3xl text-gray-500' onClick={() => {
                        setvolume(0);
                        audioRef.current.volume = 0;
                    }}><FaVolumeMute /></i>
                    <input type="range" className="p-0  " value={volume}
                        min={0} max={1} step={0.1}
                        onChange={(e) => {
                            audioRef.current.volume = e.target.value
                            setvolume(e.target.value)
                        }} />
                    <i className='text-3xl text-gray-500'><FaVolumeUp /></i>
                </div>
            </div>
        </div>
    );
}

export default Player;