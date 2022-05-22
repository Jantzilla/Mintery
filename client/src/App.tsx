import logo from './white-logo.png'
import { Component } from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import {
  Container,
  Grid,
  Image,
  Menu,
  Segment,
} from 'semantic-ui-react'

import Auth from './auth/Auth'
import { EditNFT } from './components/EditNFT'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { NFTs } from './components/NFTs'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>
        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.generateMenu()}

                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  generateMenu() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu fixed='top' inverted color='teal'>
          <Container>
            <Menu.Item as='a' header>
              <Image size='mini' src={logo} style={{ marginRight: '1.5em' }} />Mintery</Menu.Item>
            <Menu.Item position='right' onClick={this.handleLogout} as='a'>Logout</Menu.Item>
    
          </Container>
        </Menu>
      )
    }
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <NFTs {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/nfts/:NFTId/edit"
          exact
          render={props => {
            return <EditNFT {...props} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
