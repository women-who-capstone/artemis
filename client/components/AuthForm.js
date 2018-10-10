import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { auth, deleteError } from '../reducers/user';
import { Typography, FormGroup } from '@material-ui/core';

const styles = (theme) => ({
	button: {
		margin: theme.spacing.unit,
		width: '100px',
		height: '30px'
	},
	input: {
		display: 'none'
	},
	root: {
		flexGrow: 1
	},
	container: {
		display: 'flex',
		flexWrap: 'no-wrap',
		alignItems: 'baseline'
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		backgroundColor: 'transparent'
	},
	dense: {
		marginTop: 16
	},
	menu: {
		width: 200
	},
	authLabel: {
		color: '#424242',
		fontSize: '1.25rem',
		margin: '8px'
	},
	authGroup: {
		alignItems: 'baseline'
	}
});

class AuthForm extends Component {
	constructor() {
		super();
		this.state = {
			isError: false
		};
		this.changingError = this.changingError.bind(this);
	}

	changingError(event) {
		event.preventDefault();
		this.props.error = '';
	}
	render() {
		let { name, displayName, handleSubmit, error, classes } = this.props;

		return (
			<form className={classes.container} autoComplete="off" onSubmit={handleSubmit} name={name}>
				<FormGroup row={true} className={classes.authGroup}>
					<TextField
						required
						id="outlined-email-input"
						label="Email"
						className={classes.textField}
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
						className={classes.textField}
						type="password"
						name="password"
						autoComplete="current-password"
						margin="normal"
						size="small"
					/>
					<Button className={classes.button} type="submit" name="" variant="outlined" color="secondary">
						{displayName}
					</Button>
					{error && error.response && <div> {error.response.data} </div>}
				</FormGroup>

				{name === 'login' ? (
					<Link to="/signup" onClick={() => this.props.removingError()}>
						Create a new account
					</Link>
				) : (
					<Link to="/" onClick={() => this.props.removingError()}>
						Login here
					</Link>
				)}
			</form>
		);
	}
}

const mapLogin = (state) => {
	return {
		name: 'login',
		displayName: 'Login',
		error: state.user.error
	};
};

const mapSignup = (state) => {
	return {
		name: 'signup',
		displayName: 'Sign Up',
		error: state.user.error
	};
};

const mapDispatch = (dispatch) => {
	return {
		handleSubmit: (evt) => {
			evt.preventDefault();
			const formName = evt.target.name;
			const email = evt.target.email.value;
			const password = evt.target.password.value;
			dispatch(auth(email, password, formName));
		},
		removingError: () => {
			dispatch(deleteError());
		}
	};
};

export const Login = withStyles(styles)(connect(mapLogin, mapDispatch)(AuthForm));

export const Signup = withStyles(styles)(connect(mapSignup, mapDispatch)(AuthForm));
