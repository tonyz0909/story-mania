import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import Home from './components/home';
import MenuBar from './components/menu';

function App() {
  return (
    <div className="App">
      <MenuBar />
      <Home />
    </div>
  );
}

export default App;
