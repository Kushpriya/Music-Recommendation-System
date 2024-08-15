import React, { useEffect, useState } from 'react'
import axios from "axios"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { HideLoading, ShowLoading } from '../redux/alertSlice';
import SongList from './SongsList';
import { SetAllSongs } from '../redux/userSlice';
import PlayList from './PlayList';
import Player from './Player';
import Recommendation from './Recommendation'


function Home() {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch()

   
 
    return (
        <>
        <div className='flex gap-5'>
            <div className='w-1/2 '>
                <SongList />
            </div>
            <div className='flex flex-col w-1/2 gap-2'>
            <div className=' h-1/2  '> 
                <PlayList />
             
            </div>
            <div className=' h-1/2 ' >
               <Recommendation /> 
            </div>
            </div>
        </div>
        <Player />
        </>
    )
    // return (
    //     <Header />

    // )
}

export default Home