import React from 'react'
import Navbar from './HelperComponents/Navbar'

function Notification() {


    const notifications = [
        {
            date: "06/26/2024",
            notifications: [
                {
                    "invokedUser": "User5",
                    "targetUser": "User6",
                    "type": "follow",
                    "time": "06/26/2024, 01:00 PM",
                    "notification": "User5 followed User6"
                },
                {
                    "invokedUser": "User6",
                    "targetUser": "User5",
                    "type": "comment",
                    "time": "06/26/2024, 01:10 PM",
                    "notification": "User6 commented on User5's post"
                }
            ]
        },
        {
            date: "06/25/2024",
            notifications: [
                {
                    "invokedUser": "User1",
                    "targetUser": "User2",
                    "type": "follow",
                    "time": "06/25/2024, 12:00 PM",
                    "notification": "User1 followed User2"
                },
                {
                    "invokedUser": "User3",
                    "targetUser": "User2",
                    "type": "like",
                    "time": "06/25/2024, 12:05 PM",
                    "notification": "User3 liked User2's post"
                },
                {
                    "invokedUser": "User1",
                    "targetUser": "User3",
                    "type": "comment",
                    "time": "06/25/2024, 12:10 PM",
                    "notification": "User1 commented on User3's post"
                },
                {
                    "invokedUser": "User2",
                    "targetUser": "User1",
                    "type": "follow",
                    "time": "06/25/2024, 12:15 PM",
                    "notification": "User2 followed User1"
                },
                {
                    "invokedUser": "User4",
                    "targetUser": "User2",
                    "type": "like",
                    "time": "06/25/2024, 12:20 PM",
                    "notification": "User4 liked User2's post"
                },
                {
                    "invokedUser": "User2",
                    "targetUser": "User4",
                    "type": "comment",
                    "time": "06/25/2024, 12:25 PM",
                    "notification": "User2 commented on User4's post"
                }
            ]
        },
        {
            date: "06/27/2024",
            notifications: [
                {
                    "invokedUser": "User7",
                    "targetUser": "User8",
                    "type": "like",
                    "time": "06/27/2024, 02:00 PM",
                    "notification": "User7 liked User8's post"
                },
                {
                    "invokedUser": "User8",
                    "targetUser": "User7",
                    "type": "follow",
                    "time": "06/27/2024, 02:30 PM",
                    "notification": "User8 followed User7"
                }
            ]
        }
    ]

    const currentDate = new Date();

    // Extracting date components
    const day = currentDate.getDate().toString().padStart(2, '0'); // Pad with zero if single digit
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = currentDate.getFullYear();

    // Creating the formatted date string
    const formattedDate = `${month}/${day}/${year}`;
    return (
        <>
            <Navbar />
            <div className='text-white md:ml-[320px] max-w-full  h-screen'>
                <div className='w-full h-25  py-3 md:py-5  pl-3 border-b border-gray-600 sticky top-0 bg-black'>
                    <h1 className='text-xl font-semibold md:text-3xl md:font-bold'>Notificaion</h1>
                </div>
                <div className=' max-w-[800px] pl-2 max-h-[600px] overflow-y-scroll no-scrollbar  '>
                    {
                        notifications.map((obj, index) => (
                            <div className='mt-5 w-full'>
                                <h1 className='text-xl md:text-2xl font-semibold '>{formattedDate === obj.date ? 'Today' : obj.date}</h1>
                                {obj.notifications.map((not, idx) => (
                                    <div className='flex justify-between bg-gray-800 mt-3 h-14 mr-3 rounded-md px-2 items-center'>
                                        <p className='max-w-[400px] md:text-[17px] text-sm'>{not.notification}</p>
                                        {not.type === 'follow' && <button className='border md:text-sm text-xs border-gray-200
                                        rounded-md py-1 px-3'>Follow back</button>}
                                    </div>
                                ))}
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default Notification