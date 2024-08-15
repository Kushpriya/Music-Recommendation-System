import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SetCurrentSong } from '../redux/userSlice';

function Recommendation() {
  const dispatch = useDispatch();
  const { currentSong, allSongs } = useSelector((state) => state.user);
  const [messageTitle, setMessageTitle] = useState([]);

  const formData = currentSong?.title;

  useEffect(() => {
    // Call handleSubmit when currentSong changes
    handleSubmit();
  }, [currentSong]);

  const handleSwitch = (id) => {
    const targetId = id;
    const targetSong = allSongs.find((song) => song._id === targetId);

    if (targetSong) {
      // Dispatch the handleSong action with the targetSong
      dispatch(SetCurrentSong(targetSong));
    } else {
      console.log(`Song with ID ${targetId} not found`);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://127.0.0.1:7777/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Check if the response status is OK (HTTP status code 200)
      if (response.ok) {
        const responseData = await response.json();

        // Assuming 'message' is an array in the JSON response
        // Check if the 'message' property exists and is an array
        if (Array.isArray(responseData.Message)) {
          const messageTitle = responseData.Message;
          setMessageTitle(responseData);
        } else {
          console.error('Error: "message" property is not an array in the response');
        }
      } else {
        console.error('Error:', response.statusText);
        // Set appropriate error message if needed
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Set an appropriate error message
    }
  };

  return (
    <div>
      <h1>Recommendation</h1>
      <div>
        {messageTitle.Message?.map((song, index) => (
          <div
            className={'p-2 text-gray-600 flex item-center justify-between border cursor-pointer'}
            onClick={() => {
              handleSwitch(messageTitle.id[index]);
            }}
            key={index}
          >
            <div>
              <h1>{song}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recommendation;
