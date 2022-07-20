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
import React from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Link, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
const SigninScreen = () => {
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  return (
    <>
      <Container className="small-container">
        <h1 className="my-3">Sign in</h1>{' '}
        <Form>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Email</Form.Label>
            <Form.Control type="password" required />
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

// export default SigninScreen;
