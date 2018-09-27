import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import classNames from 'classnames'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: 'none'
  },
  root: {
    flexGrow: 1
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  }
})

const AuthForm = props => {
  const { name, displayName, handleSubmit, error } = props
  return (
    <Grid container spacing={8}>
      <form
        className={styles.container}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        name={name}
      >
        <TextField
          required
          id="outlined-email-input"
          label="Email"
          className={styles.textField}
          type="email"
          name="email"
          autoComplete="email"
          margin="normal"
          size="small"
        />
        <TextField
          required
          id="outlined-password-input"
          label="Password"
          className={styles.textField}
          type="password"
          autoComplete="current-password"
          margin="normal"
          size="small"
        />
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          className={styles.button}
        >
          {props.displayName}
        </Button>
      </form>
    </Grid>
  )
}

const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(auth(email, password, formName))
    }
  }
}

export const Login = connect(
  mapLogin,
  mapDispatch
)(AuthForm)
export const Signup = connect(
  mapSignup,
  mapDispatch
)(AuthForm)

export default withStyles(styles)(AuthForm)
