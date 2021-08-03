import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  NavLink,
} from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import LoginForm from './components/loginForm'
import SprocForm from './components/sprocForm'
import auth, { logout } from '../src/services/authService'
import Logout from './components/logout'
import Home from './components/home'
import Country from './components/country'
import Cities from './components/cities'
import ItemMaster from './components/itemMaster'
import Invoice from './components/invoice'

function App(props) {
  const authUser = auth.getCurrentUser()

  console.log(props)

  return (
    <div className="container" style={{ marginTop: 10 }}>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">
          Data Ocean
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <Link className="nav-link" to="/">
              Home
            </Link>

            <Link className="nav-link" to="/country">
              Country
            </Link>

            <li className="nav-item active">
              <NavLink className="nav-link" to="/city">
                City
              </NavLink>
            </li>
            <li className="nav-item active">
              <NavLink className="nav-link" to="/items">
                Item
              </NavLink>
            </li>
            <li className="nav-item active">
              <NavLink className="nav-link" to="/invoice">
                Invoice
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/country" component={Country}></Route>
        <Route path="/city" component={Cities}></Route>
        <Route path="/items" component={ItemMaster}></Route>
        <Route path="/invoice" component={Invoice}></Route>
      </Switch>
    </div>
  )
}

export default App
