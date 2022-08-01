import axios from '../axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const reducer = (state, action) => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };

    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const OrderScreen = () => {
  // const { orderId } = useParams();
  const params=useParams();
  const {id:orderId}=params;
  // const {orderId}=useParams();
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, order, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    order: {},
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const {data} = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }
    };
    if (!userInfo) {
      return navigate('/login');
    }
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [userInfo, order, orderId, navigate]);
  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <h1>Order {orderId}</h1>
      <h1>Hello brother</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong>{order.shippingAddress.fullName}<br />
                <strong>Address:</strong>{order.shippingAddress.address},
                {order.shippingAddress.city}, {order.shippingAddress.postalCode},
                {order.shippingAddress.Country}

              </Card.Text>

              {order.isDelivered ? (
                <MessageBox variant="success">Delivered at {order.deliveredAt}</MessageBox>
              ):(<MessageBox vairant="danger">Not Delivered</MessageBox>)}
            </Card.Body>
          </Card>

          <Card className="mb-3">
              <Card.Body>
                <Card.Title>Payment</Card.Title>
                <Card.Text><strong>Method:</strong>{order.paymentMethod}</Card.Text>
                {order.isPaid ? (<MessageBox variant="success">Paid at {order.paidAt}</MessageBox>)
                :(<MessageBox variant="danger">Not Paid</MessageBox>)
              }
              </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderScreen;
