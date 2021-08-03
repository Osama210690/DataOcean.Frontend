import React, { useState } from 'react'
import Joi from 'joi-browser'
import auth from '../services/authService'
import { withRouter } from 'react-router-dom'

const LoginForm = (props) => {
  const [userData, setUserData] = useState({ username: '', password: '' })
  const [userErrors, setUserErrors] = useState()

  const doSubmit = async () => {
    try {
      await auth.login(userData.username, userData.password)
      const { state } = props

      window.location = state ? state.from.pathname : '/'
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...userErrors }
        errors.Message = ex.response.data.message
        setUserErrors(errors)
      }
    }
  }

  return (
    <div className="col-lg-6 mt-2">
      <h3>Login</h3>
      <form>
        <p>
          {userErrors && (
            <div className="alert alert-danger" role="alert">
              {userErrors.Message}
            </div>
          )}
        </p>

        <div className="form-group">
          <label htmlFor="username">Username</label>

          <input
            name="username"
            id="username"
            onChange={(e) => {
              const userDataCopy = { ...userData }
              userDataCopy.username = e.target.value

              setUserData(userDataCopy)
            }}
            value={userData.username}
            className="form-control"
          />
          {/* {error && <div className="alert alert-danger">{error}</div>} */}
        </div>
        <div className="form-group">
          <label htmlFor="username">Password</label>
          <input
            name="password"
            id="password"
            type="password"
            onChange={(e) => {
              const userDataCopy = { ...userData }
              userDataCopy.password = e.target.value

              setUserData(userDataCopy)
            }}
            value={userData.password}
            className="form-control"
          />
          {/* {error && <div className="alert alert-danger">{error}</div>} */}
        </div>
        <button
          onClick={doSubmit}
          type="button"
          className="btn btn-primary mt-2"
        >
          Sign In
        </button>
      </form>
    </div>
  )
}

export default LoginForm
