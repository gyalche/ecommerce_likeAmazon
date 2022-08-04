import axios from '../axios';
import React, { useEffect, useReducer, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";

function reducer(state, action){
    switch(action.type){
        case 'FETCH_REQUEST':
            return {...state, loading:true};
        
        case 'FETCH_SUCCESS':
            return{...state, products:action.payload.products,
                    page:action.payload.page,
                    pages:action.payload.pages,
                    countProducts:action.payload.countProducts,
                    loading:false
            };

        case 'FETCH_FAIL':
            return{...state, loading:false, error:action.payload}

        default:
            return state;
    }
};
const prices=[
    {
        name:'$1 to $50',
        value: '1-50'
    },
    {
        name:'$51 to $200',
        value: '50-200'
    },
    {
        name:'$201 to $1000',
        value: '201-1000'
    },
];

export const rating=[
    {
        name: '4stars & up',
        rating:4,
    },
    {
        name: '3stars & up',
        rating:3,
    },
    {
        name: '2stars & up',
        rating:2,
    },
    {
        name: '1stars & up',
        rating:1,
    }
]
const SearchScreen = () => {
    const navigate = useNavigate();
    const {search}=useLocation();
    const sp=new URLSearchParams(search);// sarch?category=whatevery you search;

    const category=sp.get('category') || 'all';
    const query=sp.get('query') || 'all';
    const price=sp.get('price') || 'all';
    const ratings=sp.get('rating') || 'all';
    const order=sp.get('order') || 'newest';
    const page=sp.get('page') || 1;

    const [{loading, error, products, pages, countProducts}, dispatch]=useReducer(reducer,{
        loading:true,
        error:''
    })

    useEffect(() => {
        const fetchData=async ()=>{
            try {
                const {data}= await axios.get(`/api/products/search?page=${page}$query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`);
                dispatch({type:'FETCH_SUCCESS', payload:data});
            } catch (error) {
                dispatch({type:'FETCH_FAIL', payload:error.message});
            }
        }
        fetchData();
    }, [category, error, order, page, price, query, rating]);

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        
        const fetchCategories = async ()=>{
            try {
                const {data}= await axios.get('/api/products/categories');
                setCategories(data);
            } catch (error) {
                toast.error(error.message)
            }
        }
    }, [])

    const getFilterUrl=(filter) =>{
        const filterPage=filter.page || page;
        const filterCategory=filter.category || category;
        const filterQuery=filter.query || query;
        const filterRating=filter.rating || rating;
        const filterPrice=filter.price || price;
        const sortOrder=filter.order || order;

        return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&sortOrder=${sortOrder}&filterPage=${filterPage}&filterRating=${filterRating}&`
    }
  return (
    <div>
        <Row>
            <Col md={3}>
                <h3>Department</h3>
                <div>
                    <ul>
                        <li>
                            <Link className={'all'===category? 'text-bold': ''}
                                to={getFilterUrl({category: 'all'})}>
                                    Any
                                </Link>
                        </li>

                        {categories.map((c)=>(
                            <li ke={c}>
                                <Link className={c===category? 'text-bold': ''}
                                to={getFilterUrl({category: c})}>{c}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3>Price</h3>
                    <ul>
                        <li>
                            <Link className={'all'===price? 'text-bold': ''}
                            to={getFilterUrl({price: 'all'})}>Any</Link>
                        </li>

                        {prices.map((p)=>(
                            <li key={p.value}>
                                <Link to={getFilterUrl({price:p.value})}
                                    className={p.value === price? 'text-bold': ''}
                                >{p.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3>Avg. Customer Review</h3>

                    <ul>
                        {ratings.map((r)=>(
                            <li key={r.name}>
                                <Link to={getFilterUrl({rating:r.rating})}
                                className={`${r.rating}` === `${rating}` ? 'text-bold' : ''}>
                                    <Rating caption={' & up'} rating={r.rating}></Rating>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </Col>
        </Row>
    </div>
  )
}

export default SearchScreen