// // import React, from 'react';
// import Container from 'react-bootstrap/Container';
// import Form from 'react-bootstrap/Form';
// import { Link } from 'react-router-dom';
// import Button from 'react-bootstrap/Button';

// export default function SigninScreen() {
//   return (
//     <Container className="small-container">
//       <h1 className="my-3">Sign in</h1>
//       <Form>
//         <Form.Group className="mb-3" controlId="email">
//           <Form.label>Email</Form.label>
//           <Form.control type="email" required />
//         </Form.Group>

//         <Form.Group className="mb-3" controlId="password">
//           <Form.label>Email</Form.label>
//           <Form.control type="password" required />
//         </Form.Group>

//         <div className="mb-3">
//           <Button type="submit">Sign in</Button>
//         </div>
//         <div className="mb-3">
//           New Customer? <Link to={`/`}>Create your account</Link>
//         </div>
//       </Form>
//     </Container>
//   );
// }
import React, { useContext, useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axios from '../axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';
const SigninScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const submitHandler = async (e) => {
    const outputs = {
      email,
      password,
    };
    e.preventDefault();
    try {
      await axios.post('api/user/login', outputs).then((response) => {
        console.log(response);
        if (response.data.token) {
          // alert('sucessfully registered');
          localStorage.setItem('userInfo', JSON.stringify(response.data));
          ctxDispatch({ type: 'USER_SIGNIN', payload: response.data });
          navigate(redirect || '/');
        }
      });
    } catch (error) {
      toast.error('Invalid email or password');
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
        <h1 className="my-3">Sign in</h1>{' '}
        <Form onSubmit={submitHandler}>
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
            <Button type="submit">Sign in</Button>
          </div>
          <div className="mb-3">
            New Customer?{' '}
            <Link to={`/signup?redirect-${redirect}`}>Create your account</Link>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default SigninScreen;
