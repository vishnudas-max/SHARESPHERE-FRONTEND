import React from 'react'
import { createContext,useState } from 'react'

export const ForgotPasswordContext = createContext()

function ForgotPasswordContextProvider({children}) {
    const [forgotpasswordData,setForgotpasswordData] = useState(null)
    return(
        <ForgotPasswordContext.Provider value={{forgotpasswordData , setForgotpasswordData}}>
            {children}
        </ForgotPasswordContext.Provider>
    )

}

export default ForgotPasswordContextProvider