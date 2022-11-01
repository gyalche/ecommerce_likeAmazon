import React, { useContext, useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axios from '../axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';
const SignupScreen = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

   const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    const outputs = {
      username,
      email,
      password,
    };
    e.preventDefault();
    try {
      await axios.post('/api/user/register', outputs).then((response) => {
        console.log(response);
        if (response.data) {
          // alert('sucessfully registered');
          localStorage.setItem(
            'userInfo',
            JSON.stringify(response.data)
          );
          ctxDispatch({ type: 'USER_SIGNIN', payload: response.data });
          toast.success('sucessfully signed in');
          navigate(redirect || '/');
        }
      });
    } catch (error) {
      toast.error('unable to signin');
    }
  };
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo]);
  return (
    <>
      <Container className="small-container">
        <h1 className="my-3">Sign Up</h1>{' '}
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <div className="mb-3">
            <Button type="submit">Sign Up</Button>
          </div>
          <div className="mb-3">
            Already have an account?{' '}
            <Link to={`/signin?redirect-${redirect}`}>Signin</Link>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default SignupScreen;
