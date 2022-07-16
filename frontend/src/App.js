import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext } from 'react';
import { Store } from './Store';
function App() {
  const { state } = useContext(Store);
  const { cart } = state;

  return (
    <Router>
      <div className="d-flex flex-column site-container">
        <header>
          <Navbar bg="dark" varient="dart">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>
                  <span style={{ color: 'white' }}>Amazona</span>
                </Navbar.Brand>
              </LinkContainer>
              <Nav className="me-auto">
                <Link
                  to="/cart"
                  className="nav-link"
                  style={{ color: 'white' }}
                >
                  Cart
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, b) => a + b.quantity, 0)}
                    </Badge>
                  )}
                </Link>
              </Nav>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
            </Routes>
          </Container>
        </main>
      </div>
      <footer>
        <div className="text-center">All right reserved</div>
      </footer>
    </Router>
  );
}

export default App;
