import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default function Protected({children,authentication=true}){

    const navigate=useNavigate()
    const [loader,setLoader]=useState(true)
    const auth=useSelector(state=>state.auth.status)

    useEffect(()=>{
        if(authentication && auth!==authentication){
            navigate('/login')
        }
        else if(!authentication && auth!=authentication){
            navigate('/')
        }
        setLoader(false);
    },[auth,navigate,authentication])

    return loader ? <h1>Loading....</h1>:<>{children}</>
}