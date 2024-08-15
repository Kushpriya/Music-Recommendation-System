// import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// function DefaultLayout({ children }) {
//     const { user } = useSelector(state => state.user)
//     const navigate = useNavigate()
//     const admin = "Admin"
//     const [dropdownOpen, setDropdownOpen] = useState(false);


//     return (
//         <div className="main">
//             <div className="header flex justify-between p-3 shadow items-center">
//                 <h1 className='text-3xl text-gray-700 font-bold cursor-pointer'onClick={() =>{
//                     navigate('/')
//                 }}>Music</h1>
//                 <div className="flex item-center gap-2">
//                     <h1 className ="text-xl cursor-pointer hover:text-orange-500 "onClick={() =>{
//                         navigate("/admin")
//                     }}>{(user?.isAdmin) ? admin ("add dropdown button here"): null}</h1>
//                 <h1 className='text-xl'>{user?.name.toUpperCase( )}</h1>
//                 <h1 className='text-xl cursor-pointer' onClick={()=>{
//                     localStorage.removeItem('token')
//                     window.location.reload()
//                 }}>s</h1>
//                 </div>
//             </div>
//             <div className="content m-10 ">
//                 {children}
//             </div>
//         </div>
//     )
// }

// export default DefaultLayout;

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoIosLogOut } from "react-icons/io";
import { RiAdminFill } from "react-icons/ri";

function DefaultLayout({ children }) {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setDropdownOpen(false);
  }, [navigate]);

  return (
    <div className="main">
      <div className="header flex justify-between p-3 shadow items-center">
        <h1
          className="text-3xl text-gray-700 font-bold cursor-pointer"
          onClick={() => {
            navigate('/');
          }}
        >
          Music
        </h1>
        <div className="flex items-center gap-2">
          {user?.isAdmin && (
            <div className="relative">
              <h1
                className="text-xl cursor-pointer hover:text-orange-500"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <RiAdminFill />
              </h1>
              {dropdownOpen && (
                <div className="absolute bg-gray-200s border p-3 rounded-md mt-2">
                  <h1
                    className="block bg-white px-4 py-2 text-gray-800 hover:bg-orange-200 cursor-pointer"
                    onClick={() => {
                      navigate("/admin")
                    }}
                  >
                    Songs
                  </h1>
                  <h1
                    className="block px-4 py-2  text-gray-800 hover:bg-orange-200 cursor-pointer"
                    onClick={() => {
                      navigate("/admin/user")
                    }}
                  >
                    Users
                  </h1>
                </div>
              )}
            </div>
          )}
          <h1 className="text-xl">{user?.name.toUpperCase()}</h1>
          <h1
            className="text-xl cursor-pointer"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.reload();
            }}
          >
            <IoIosLogOut />
          </h1>
        </div>
      </div>
      <div className="content m-10 ">{children}</div>
    </div>
  );
}

export default DefaultLayout;
