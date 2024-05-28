import React from 'react'
import { createContext,useState } from 'react'

export const RegisterContext = createContext()

function RegisterContextProvider({children}) {

    const [email,SaveEmail] = useState(null)
    return(
        <RegisterContext.Provider value={{email , SaveEmail}}>
            {children}
        </RegisterContext.Provider>
    )

}

export default RegisterContextProvider