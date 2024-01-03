import React, { useEffect, useState } from 'react';
import Home from './components/home/Home';
import Signup from './components/user/Signup';
import Signin from './components/user/Signin';
import {Routes, Route, Link} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'
import Axios from 'axios';
import WishList from './components/home/WishList';
import CategoryList from './components/Category/CategoryList';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PostList from './components/Post/PostList';
import WishlistList from './components/wishlist/WishlistList';
import NavBar from './components/home/NavBar';
import PostCreate from './components/Post/PostCreate';
import PostEdit from './components/Post/PostEdit';
import PostDetail from './components/Post/PostDetail';

function App() {
   const [isAuth, setIsAuth] = useState(false);
   const [user, setUser] = useState({});
   useEffect(() => {
  const user = getUser();
  // console.log(user);
  if(user){
   setIsAuth(true);
   setUser(user);
  }else{
   localStorage.removeItem("token");
   setIsAuth(false);
   setUser(null);
  }
 },[])
   const registerHandle = (user) => {
     Axios.post("auth/signup", user)
     .then(res => {
       console.log(res);
     })
     .catch(err => {
       console.log(err);
     })
   }
   const loginHandle = (cred) => {
     Axios.post("auth/signin", cred)
     .then( res => {
       console.log(res.data.token);
       let token = res.data.token;
       if(token != null)
       {
         localStorage.setItem("token", token);
         const user = getUser();
         console.log(user);
         user ? setIsAuth(true) : setIsAuth(false)
         user ? setUser(user) : setUser(null)
       }
     })
     .catch(err => {
       console.log(err);
     })
   }
   const getUser =() => {
 const token = getToken();
 return token ? jwtDecode(token).user : null
   }
   const getToken = () => {
     const token = localStorage.getItem("token");
     return token;
   }
   const onLogoutHandle = (e) => {
     e.preventDefault();
     localStorage.removeItem("token");
     setIsAuth(false);
     setUser(null);
   }
   return (
     <div>
      <NavBar></NavBar>
       <div>
       <Routes>
           <Route path="/" element={ isAuth ? <Home></Home>: <Signin login={loginHandle}></Signin>}></Route>
           <Route path='/signup' element={<Signup register={registerHandle}></Signup>}></Route>
           <Route path='/signin' element ={ isAuth ? <Home/> : <Signin login={loginHandle}></Signin>}></Route>
           <Route path='category' element={<CategoryList/>}/>
           <Route path='/post' element={<PostList key={user.id} userId={user}/>}/>
           <Route path='/post/add/:userId' element={<PostCreate/>}/>
           <Route path='/post/edit/:id' element={<PostEdit/>}/>
           <Route path='/whishlist' element={<WishlistList key={user.id} userId={user}/>}/>
         </Routes>
       </div>
     </div>
   )
 }
export default App;
