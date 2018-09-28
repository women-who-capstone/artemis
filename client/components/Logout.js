import Button from '@material-ui/core/Button'
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { logout } from '../store'
import { connect } from 'react-redux'

const Logout = props => {
  const { handleClick, isLoggedIn } = props

  return <Button onClick={handleClick}>Logout</Button>
}

const mapStateToProps = state => {
  return {
    isLoggedIn: !!state.user.current.id
  }
}

const mapDispatchToProps = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Logout)
)
