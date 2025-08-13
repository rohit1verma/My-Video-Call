import { createContext } from 'react';
import axios from 'axios';
import { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import httpStatus from 'http-status';


export const AuthContext = createContext({});

const client = axios.create({
    baseURL:"http://localhost:8000/api/v1/users"
})

export const AuthProvider = ({ children }) => {
    const authContext = useContext(AuthContext);

    const[userData,setUserData] = useState(authContext);

    

    const handleRegister = async(name,username,password) =>{
        try{
            let request = await client.post("./register",{
                name:name,
                username:username,
                password:password
            })
            if(request.status === httpStatus.CREATED){
                return request.data.message;
            }else {
            // Return error message from response if not created
            return request.data.message || "Registration failed";
        }
        }catch(err){
            return err?.response?.data?.message || err?.message || "Something went wrong";;
        }
    }

    const handleLogin = async(username,password) =>{
    try{
        let request = await client.post("./login",{
            username:username,
            password:password
        });
        // console.log(username, password);
        // console.log(request.data);
        if(request.status === httpStatus.OK){
            localStorage.setItem("token",request.data.token);
        }
    }catch(err){
        throw err;
    }
    }
    const router = useNavigate();

    const getHistoryOfUser = async() => {
        try{
            let request = await client.get("/get_all_activity",{
                params:{
                    token:localStorage.getItem("token")
                }
            });
            return request.data;
        }catch(err){
            throw err;
        }
    }

      const addToUserHistory = async (meetingCode) => {
        try {
            let request = await client.post("/add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingCode
            });
            return request
        } catch (e) {
            throw e;
        }
    }

    const data = {
        userData,setUserData,getHistoryOfUser,addToUserHistory,handleRegister,handleLogin
    }
    return(
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}