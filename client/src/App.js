import React from 'react';
// import Container from "./components/Container";
// import Header from "./components/Header";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import './App.css';
import PlayNow from "./pages/PlayNow";
import UserHome from "./pages/UserHome";
import MultiPlayer from "./pages/MultiPlayer";
import GameContainer from "./GameContainer";
import SingleGameContainer from "./SPGameContainer";
import NoMatch from "./pages/NoMatch";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// added by jyoti for scoket.io
import openSocket from 'socket.io-client';
// import SinglePlayerGameContainer from './SingleGameContainer';
const socket = openSocket("http://localhost:3001");

function App() {
  return (
    <Router>
      <div>
        <Nav />
        <Switch>
          <Route exact path="/" component={UserHome} />
          <Route exact path="/play" component={PlayNow} />
          <Route exact path="/game" component={GameContainer} />
          <Route exact path="/singlegame" component={SingleGameContainer} />
          <Route exact path="/multi/" component={MultiPlayer} />
          <Route component={NoMatch} />
        </Switch>
        <Footer></Footer>

      </div>
    </Router>
  )
}

export default App;








