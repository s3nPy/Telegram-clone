import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useInput, { Validators } from '../../hooks/input.hook'
import { AuthActions } from '../../redux/actions'
import './Auth.scss'


const Auth = () => {
  const username = useInput('', [
    Validators.length({min: 5, max: 20})
  ])
  const password = useInput('', [
    Validators.length({min: 6, max: 24})
  ])
  const dispatch = useDispatch()
  const error = useSelector(state => state.auth.error)


  const handleSignIn = action => e => {
    e.preventDefault()
    const user = {
      username: username.value, 
      password: password.value
    }
    dispatch(action(user))
  }
   

  return (
    <div className="auth">
      <h5 className="header">Your Account</h5>
      <p className="hint">
        {error ? 
          <span className="error">{error}</span> : 
          'Please enter your account username and password'
        }
      </p>

      <form>
        <div className="form-control">
          <input type="text" placeholder="Username" {...username.bind}/>
          <div className="validation">
            {
              username.error?.length ? 
                (`Length should be more than ${username.error.length.min} 
                  and less than ${username.error.length.max} symbols` ) : ''
            }
          </div>
        </div>
        <div className="form-control">
          <input type="password" placeholder="Password" {...password.bind}/>
          <div className="validation">
            {
              password.error && password.error.length ? 
                (`Length should be more than ${password.error.length.min} 
                  and less than ${password.error.length.max} symbols` ) : ''
            }
          </div>
        </div>
        <button 
          onClick={handleSignIn(AuthActions.login)}
          disabled={username.error || password.error}
        >
          LOGIN
        </button>
        <button 
          onClick={handleSignIn(AuthActions.register)}
          disabled={username.error || password.error}
        >
          REGISTER
        </button>
      </form>

      <p className="link">
        <a
          href="https://github.com/s3nPy/Telegram-clone" 
          className="content"
        >
          Visit project's page on GitHub
        </a>
      </p>
    </div>
  )
}

export default Auth