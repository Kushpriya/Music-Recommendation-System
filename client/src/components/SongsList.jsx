import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SetCurrentSong, SetCurrentSongIndex, SetSelectedPlaylist } from '../redux/userSlice';

function SongList() {
    const { allSongs, currentSong, selectedPlaylist } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [songsToPlay, setSongsToPlay] = React.useState([])
    const [searchKey, setSearchKey] = React.useState("")

    useEffect(() => {
        if (selectedPlaylist) {
            if (
                selectedPlaylist &&
                selectedPlaylist.name === "All Songs" &&
                searchKey !== ""
            ) {
                const tempSongs = [];

                selectedPlaylist.songs.forEach((song) => {
                    if (JSON.stringify(song).toLowerCase().includes(searchKey)) {
                        tempSongs.push(song);
                    }
                });
                console.log(tempSongs);
                setSongsToPlay(tempSongs);
            } else {
                setSongsToPlay(selectedPlaylist?.songs);
            }
        }
    }, [selectedPlaylist, searchKey]);

    return (
        <div className='flex flex-col gap-5'>
            <div className='pl-3 pr-6'>
                <input type="text" placeholder='Songs, Artist, Album'
                    className='bg-gray-50 border border-gray-300 text-sm rounded-lg
              focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  
              dark:border-gray-600 dark:placeholder-gray-400   dark:focus:border-blue-500'
                    onFocus={() => dispatch(SetSelectedPlaylist({
                        name: "All Songs",
                        songs: allSongs,
                    }))}
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)} />
            </div>
            <div className='overflow-y-scroll h-[54vh] p-3'>
                {songsToPlay.map((song, index) => {
                    const isPlaying = currentSong?._id === song._id;
                    return (
                        <div className={`p-2 text-gray-600 flex item-center justify-between cursor-pointer 
                            ${isPlaying && 'shadow border rounded text-active font-semibold border-active' }`} onClick={() => {
                                dispatch(SetCurrentSong(song))
                                dispatch(SetCurrentSongIndex(index))
                            }} key={index}>
                            <div>
                                <h1>{song.title}</h1>
                                <h1>
                                    {song.artist} {song.album} {song.year}
                                </h1 >
                            </div>
                            <div>
                                <h1>{song.duration}</h1>
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>

    );
}

export default SongList;