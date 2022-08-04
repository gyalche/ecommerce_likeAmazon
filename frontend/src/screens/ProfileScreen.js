import React, { useContext, useReducer, useState } from 'react'
import { Store } from '../Store'
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { toast } from 'react-toastify'
import axios from 'axios'

function reducer(state, action) {
    switch(action.type) {
        case 'UPDATE_REQUEST':
            return {...state, loadingUpdate:true}

        case 'UPDATE_SUCCESS':
            return{...state, loadingUpdate:false}

        case 'UPDATE_FAIL':
            return{...state, loadingUpdate:false}

        default:
            return state;
    }
}
const ProfileScreen = () => {
    const{state, dispatch:ctxDispatch}=useContext(Store)
    const {userInfo}=state;

    const [userName, setUserName] = useState(userInfo.username);
    const [email, setEmail] = useState(userInfo.email);
    const [password, setPassword] = useState("")
    const [conformPassword, setConformPassword] = useState("")

    const [{loadingUpdate}, dispatch]=useReducer(reducer, {loadingUpdate:false})
    const submitHandler= async(e)=> {
        e.preventDefault();
        try {
            const {data}= await axios.put(`/api/user/profile`,
            {userName, email, password},
            {headers:{Authorization: 'Bearer ${userInfo.token'}})
            dispatch({type:'UPDATE_SUCCESS'});
            ctxDispatch({type:'USER_SIGNIN', payload:data});
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success("User updated successfully");
        } catch (error) {
            dispatch({type: 'UPDATE_FAIL'});
            toast.error(error.message);
        }

    }

  return (
    <div className="container small-container">
        <h1 className="my-3">User Profile</h1>
        <form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="username">
                <Form.Label>Name</Form.Label>
                <Form.Control value={userName} onChange={(e)=>setUserName(e.target.value)}
                required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control value={email} onChange={(e)=>setEmail(e.target.value)}
                required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control value={password} onChange={(e)=>setPassword(e.target.value)}
                required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="conformPassword">
                <Form.Label>conform password</Form.Label>
                <Form.Control value={conformPassword} onChange={(e)=>setConformPassword(e.target.value)}
                required />
            </Form.Group>

            <div className="mb-3">
                <Button type="submit">Update</Button>
            </div>
        </form>
    </div>
  )
}

export default ProfileScreen