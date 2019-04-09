import * as React from 'react'
import {
  AppBar, Toolbar, Button, Typography, Paper, TextField, withWidth, Divider
} from '@material-ui/core'
import Router from 'next/router'
import withRoot from '../components/imports/withRoot'

import { ip } from '../config.json'
import * as fetch from 'isomorphic-unfetch'

interface S {
  username: string, password: string, failedAuth: boolean, requestFail: boolean
}

const description = `ez.chat is a versatile, functional and elegant chat app that's \
easy to use.`

class Login extends React.Component<{ width: 'xs'|'sm'|'md'|'lg'|'xl' }, S> {
  constructor (props: { width: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) {
    super(props)
    this.state = { username: '', password: '', failedAuth: false, requestFail: false }
    this.login = this.login.bind(this)
  }

  async componentDidMount () {
    // Automatically forward to chat if logged in.
    try { if (localStorage.getItem('token')) Router.push('/chat') } catch (e) {}
  }

  async login () {
    try {
      const request = await fetch(ip + '/api/users/auth', {
        method: 'POST', headers: { Username: this.state.username, Password: this.state.password }
      })
      // If request failed..
      if (!request.ok) {
        // If it was an authentication error, we handle it by setting failedAuth to true.
        if (request.status === 401) this.setState({ failedAuth: true })
        // If the request failed, we set that as state.
        else this.setState({ requestFail: true })
        return
      }
      // Parse response.
      const response = await request.json()
      // Save the token in localStorage if we are on the client.
      // We'll add sessionStorage support later for Remember Me stuff.
      try {
        if (localStorage && response.token) {
          localStorage.setItem('token', response.token)
          // Also, if authentication previously failed, let's just say it succeeded.
          this.setState({ failedAuth: false, requestFail: false })
          // Then we redirect to the new page.
          Router.push('/chat')
        }
      } catch (e) {}
    } catch (e) {
      this.setState({ requestFail: true })
      console.error(e)
    }
  }

  render () {
    // Responsive styling.
    const paperStyle = ['xs', 'sm'].includes(this.props.width) ? { flex: 1 } : { width: '25vw' }
    const allowLogin = !this.state.username || !this.state.password
    // Return the code.
    return (
      <>
        <div style={{ marginRight: 16, marginLeft: 16 }}>
          <>
            <title>Login - ez.chat</title>
            {/* <meta property='og:url' content={`${rootURL}/`} /> */}
            <meta property='og:description' content={description} />
            <meta name='Description' content={description} />
          </>
          <AppBar>
            <Toolbar>
              <Typography variant='h6' color='inherit' style={{ flex: 1 }}>ez.chat</Typography>
            </Toolbar>
          </AppBar>
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'
          }}>
            <Paper elevation={24} style={{ padding: 15, ...paperStyle }}>
              <Typography variant='h5' style={{ textAlign: 'center' }} gutterBottom>
                Log In
              </Typography><Divider /><br />
              <Typography variant='body1' style={{ textAlign: 'center' }} gutterBottom>
                Welcome back!
              </Typography>
              <TextField required label='Username' fullWidth value={this.state.username}
                onChange={e => this.setState({ username: e.target.value })} autoFocus
                error={this.state.failedAuth} />
              <br /><br />
              <TextField required label='Password' fullWidth value={this.state.password}
                onChange={e => this.setState({ password: e.target.value })} type='password'
                onSubmit={this.login} onKeyPress={e => e.key === 'Enter' && this.login()}
                error={this.state.failedAuth} />
              <br />{this.state.failedAuth ? (<><br />
                <Typography color='error'>Your username or password is incorrect.</Typography>
              </>) : (this.state.requestFail ? (<>
                <br />
                <Typography color='error'>
                  There was an unknown error processing your request.
                </Typography>
              </>) : '')}<br />
              <Button variant='contained' color='secondary' onClick={this.login} fullWidth
                disabled={allowLogin}>Log In</Button>
            </Paper>
          </div>
        </div>
      </>
    )
  }
}

export default withRoot(withWidth()(Login))
