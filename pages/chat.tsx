import * as React from 'react'
import {
  AppBar, Toolbar, Typography
} from '@material-ui/core'
import Router from 'next/router'
import withRoot from '../components/imports/withRoot'

// import { ip } from '../config.json'
// import * as fetch from 'isomorphic-unfetch'

interface S {}

const description = `ez.chat is a versatile, functional and elegant chat app that's \
easy to use.`

class Chat extends React.Component<{/* width: 'xs' | 'sm' | 'md' | 'lg' | 'xl' */}, S> {
  constructor (props: {/* width: 'xs' | 'sm' | 'md' | 'lg' | 'xl' */}) {
    super(props)
    this.state = {}
  }

  async componentDidMount () {
    // If not logged in, redirect to login page.
    try { if (!localStorage.getItem('token')) Router.push('/login') } catch (e) { }
  }

  render () {
    // Return the code.
    return (
      <>
        <div style={{ marginRight: 16, marginLeft: 16 }}>
          <>
            <title>ez.chat</title>
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
            <Typography>You are logged in.</Typography>
          </div>
        </div>
      </>
    )
  }
}

export default withRoot(Chat)
