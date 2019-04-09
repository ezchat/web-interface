import * as React from 'react'
import {
  AppBar, Toolbar, Button, Typography, Paper, TextField, withWidth, Divider
} from '@material-ui/core'
import Router from 'next/router'
import withRoot from '../components/imports/withRoot'

import { ip } from '../config.json'
import * as fetch from 'isomorphic-unfetch'

interface S {
  username: string, password: string, failure: boolean, email: string, confirm: string
}

const description = `ez.chat is a versatile, functional and elegant chat app that's \
easy to use.`

class Register extends React.Component<{ width: 'xs'|'sm'|'md'|'lg'|'xl' }, S> {
  constructor (props: { width: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) {
    super(props)
    this.state = { username: '', password: '', confirm: '', email: '', failure: false }
    this.register = this.register.bind(this)
  }

  async componentDidMount () {
    // Automatically forward to chat if logged in.
    try { if (localStorage.getItem('token')) Router.push('/chat') } catch (e) {}
  }

  async register () {
    try {
      const request = await fetch(ip + '/api/users/register', {
        method: 'POST',
        headers: {
          Username: this.state.username,
          Password: this.state.password,
          Email: this.state.email
        }
      })
      // If request failed..
      if (!request.ok) {
        // If the request failed, we set that as state.
        this.setState({ failure: true })
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
          this.setState({ failure: false })
          // Then we redirect to the new page.
          Router.push('/chat')
        }
      } catch (e) {}
    } catch (e) {
      this.setState({ failure: true })
      console.error(e)
    }
  }

  render () {
    // Responsive styling.
    const paperStyle = ['xs', 'sm'].includes(this.props.width) ? { flex: 1 } : { width: '33vw' }
    const allowRegister = !this.state.username || !this.state.password || !this.state.email ||
      !this.state.confirm || (this.state.password !== this.state.confirm)
    // Return the code.
    return (
      <>
        <div style={{ marginRight: 16, marginLeft: 16 }}>
          <>
            <title>Register - ez.chat</title>
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
                Register an Account
              </Typography><Divider /><br />
              <Typography variant='body1' style={{ textAlign: 'center' }} gutterBottom>
                Welcome to ez.chat! Fill in the following details to register an account.
              </Typography>
              <TextField required label='Username' fullWidth value={this.state.username}
                onChange={e => this.setState({ username: e.target.value })} autoFocus />
              <br /><br />
              <TextField required label='E-mail' fullWidth value={this.state.email}
                onChange={e => this.setState({ email: e.target.value })} />
              <br /><br />
              <TextField required label='Password' fullWidth value={this.state.password}
                onChange={e => this.setState({ password: e.target.value })} type='password'
                onSubmit={this.register} onKeyPress={e => e.key === 'Enter' && this.register()}
                error={this.state.password !== this.state.confirm} />
              <br /><br />
              <TextField required label='Confirm Password' fullWidth value={this.state.confirm}
                onChange={e => this.setState({ confirm: e.target.value })} type='password'
                onSubmit={this.register} onKeyPress={e => e.key === 'Enter' && this.register()}
                error={this.state.password !== this.state.confirm} />
              <br />{this.state.password !== this.state.confirm ? (<><br />
                <Typography color='error'>Your passwords do not match!</Typography>
              </>) : (this.state.failure ? (<>
                <br />
                <Typography color='error'>
                  There was an unknown error processing your request.
                </Typography>
              </>) : '')}<br />
              <Button variant='contained' color='secondary' onClick={this.register} fullWidth
                disabled={allowRegister}>Register</Button>
            </Paper>
          </div>
        </div>
      </>
    )
  }
}

export default withRoot(withWidth()(Register))
