import React from 'react'
import { createContext,useState } from 'react'

export const RegisterContext = createContext()

function RegisterContextProvider({children}) {

    const [regdata,setRegdata] = useState(null)
    return(
        <RegisterContext.Provider value={{regdata , setRegdata}}>
            {children}
        </RegisterContext.Provider>
    )

}

export default RegisterContextProvider