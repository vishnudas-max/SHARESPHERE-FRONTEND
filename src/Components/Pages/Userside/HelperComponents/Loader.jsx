import React from 'react'

function Loader() {
    return (
        <div className="flex justify-center w-full">
            <div className='flex-col justify-center items-center '>
                <div className="size-9 md:size-16 border-4 border-dashed rounded-full animate-spin border-blue-500 mt-3"></div>
            </div>

        </div>
    )
}

export default Loader