import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import CartScree from './screens/CartScree';
import SigninScreen from './screens/SigninScreen';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SginupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/orderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import Button from "react-bootstrap/Button";
import axios from './axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';


function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href="/signin"
  };
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories=async()=>{
      try {
        const {data} = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (error) {
        toast.error("unable to find categoreis")
      }
    }
    fetchCategories();
  }, [])
  return (
    <Router>
      <div className={sidebarIsOpen?"d-flex flex-column site-container active-cont":"d-flex flex-column site-container"}>
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="dark" varient="dart" expand="lg">
            <Container>
            <Button variant="dark" onClick={()=>setSidebarIsOpen(!sidebarIsOpen)}>
              <i className="fas fa-bars"></i>
            </Button>
              <LinkContainer to="/">
                <Navbar.Brand>
                  <span style={{ color: 'white' }}>Amazona</span>
                </Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
              <SearchBox />
              <Nav className="me-auto w-100 justify-content-end">
                <Link
                  to="/cart"
                  className="nav-link"
                  style={{ color: 'white' }}
                >
                  Cart
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
                {userInfo ? (
                  <NavDropdown
                    className="name_profile"
                    title={userInfo?.username}
                    id="basic-nav-dropdown"
                  >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>UserProfile</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to="/orderhistory">
                      <NavDropdown.Item>Order History</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="#signout"
                      onClick={signoutHandler}
                    >
                      Sign Out
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link
                    className="nav-link"
                    to="/signin"
                    style={{ color: 'white' }}
                  >
                    Sign in
                  </Link>
                )}
              </Nav>
              </Navbar.Collapse>

            </Container>
          </Navbar>
        </header>

        <div className={sidebarIsOpen ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
                      : "side-navbar d-flex justify-content-between flex-wrap flex-column"
      }>
           <Nav className="flex-column text-white w-100 p-2">
              <Nav.Item>
                <strong>Categories</strong>

              </Nav.Item>
              {categories.map((category)=>(
                <Nav.Item key={category}>
                  <LinkContainer to={`/search?category=${category}`}
                    onClick={()=>setSidebarIsOpen(false)}
                  >
                  <Nav.Link>{category}</Nav.Link>
                  </LinkContainer>
                </Nav.Item>
              ))}
           </Nav>       
        </div>
        <main>
          <Container>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/cart" element={<CartScree />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/orderhistory" element={<OrderHistoryScreen />} />
              <Route path="/search" element={<SearchScreen />} />

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
