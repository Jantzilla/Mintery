import logo from '../teal-logo.png'
import * as React from 'react'
import Auth from '../auth/Auth'
import { Button, Form, Grid, Header, Image, Segment } from 'semantic-ui-react'

interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <Grid textAlign='center' verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 500 }}>
          <Form size='large'>
            <Segment style={{ padding: '5em 5em' }}>
            <Image size='tiny' centered src={logo} />
              <Header as='h1' color='teal' textAlign='center' style={{ padding: '0em 2em 2em 2em' }}>Mintery</Header>
              <Button onClick={this.onLogin} color='teal' fluid size='large' >
                Login | Sign-up
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    )
  }
}
