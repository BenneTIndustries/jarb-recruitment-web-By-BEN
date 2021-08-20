import React from 'react';
import './Home.css';



const Home = (user: any) => {


  return (
    <div className="home-text">
      <p className="title">Hi
        <span hidden={user.user.username === "" || user.user.adminMode === true }>, Member {user.user.username}</span>
        <span hidden={user.user.username === "" || user.user.adminMode === false }>, Admin {user.user.username}</span>
      </p>
      <p className="welcome">Welcome to Coffee.io Website</p>
    </div>
  );
}

export default Home;