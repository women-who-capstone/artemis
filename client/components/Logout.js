import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { logout } from '../store'
import { connect } from 'react-redux'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  }
})

const Logout = props => {
  const { handleClick, isLoggedIn } = props

  return isLoggedIn ? (
    <div>
      {' '}
      {/* Remove this div and just return button when design is done */}
      <Button color="secondary" className={styles.button} onClick={handleClick}>
        Logout
      </Button>
      <Typography variant="body1" gutterBottom align="right">
        (Testing location. Put Logout component in right place later.)
      </Typography>
    </div>
  ) : (
    ''
  )
}

const mapStateToProps = state => {
  return {
    isLoggedIn: !!state.user.id
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
