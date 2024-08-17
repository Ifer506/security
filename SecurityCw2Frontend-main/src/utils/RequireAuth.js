import { Navigate } from "react-router-dom"
import { useAuth } from "./authContext"

export const RequireAuth = ({ children }) => {
    const auth = useAuth()
    console.log(auth)
    if (!auth.email) {
        return <Navigate to={'/'} />
    }

    return children
}