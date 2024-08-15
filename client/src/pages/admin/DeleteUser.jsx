
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';


function DeleteEditUser() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("id");
    const { user } = useSelector(state => state.user)


    useEffect(() => {
        if (user)
            if (user?.admin && !user.isAdmin || !user?.isAdmin) {
                navigate("/")
            }
    }, [])
    useEffect(() => {
        axios.delete(`http://localhost:3001/api/users/${userId}`)
    })
    return (
        <div>DeleteEDIT USER</div>
    );
}

export default DeleteEditUser;