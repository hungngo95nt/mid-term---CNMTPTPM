import React from 'react';
import { Grid, Cell, TextField, Button, Avatar } from 'react-md'
import { Link,withRouter } from 'react-router-dom'
import { isEmail } from 'validator'
import { Register } from './api.js'
const style = {
    marginTop: "100px"
}
const text = {
    fontSize: "50px"
}
const imageStyle = {
    position: "relative",
    left: "40%",

}
class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            email: "",
            password: "",
            repassword: "",
            name: "",
            err: {}
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    onChange(value, e) {
        this.setState({
            ...this.state,
            [e.target.name]: value
        })
    }
    onSubmit() {
        const { password, repassword, email,name } = this.state
        const { history } = this.props
        if (password === repassword) {
            if (isEmail(email)) {
                Register(email, password,name)
                    .then(response => {
                        history.push({
                            pathname: '/',
                            state: { email, password, from: "register" }
                        })
                    })
                    .catch(err => {
                        this.setState(...this.state, { err: err.response.data })
                    })
            } else {
                const err = {
                    status: -1,
                    message: "invalid email"
                }
                this.setState(...this.state, err)
            }
        } else {
            const err = {
                status: -1,
                message: "invalid email"
            }
            this.setState(...this.state, err)
        }
    }
    render() {
        const { email, password, repassword,name} = this.state
        return (
            <Grid style={style}>
                <Cell size={4}></Cell>
                <Cell size={4}>
                    <TextField
                        value={name}
                        id="name"
                        name="name"
                        type="text"
                        onChange={this.onChange}
                        label="Your name"
                        customSize="username" style={{ marginTop: "20px" }} />
                    <TextField
                        value={email}
                        id="email"
                        name="email"
                        type="email"
                        onChange={this.onChange}
                        label="Email or Username"
                        customSize="username" style={{ marginTop: "20px" }} />
                    <TextField
                        value={password}
                        name="password"
                        id="password"
                        type="password"
                        label="Password"
                        onChange={this.onChange}
                        style={{ marginTop: "20px" }} />
                    <TextField
                        value={repassword}
                        name="repassword"
                        id="repassword"
                        type="password"
                        label="Retype Password"
                        onChange={this.onChange}
                        style={{ marginTop: "20px" }} />
                    <Grid>
                        <Cell size={4}><Link to="/"><Button flat primary swapTheming>Đăng nhập</Button></Link></Cell>
                        <Cell size={8} ><Button flat secondary swapTheming onClick={this.onSubmit}>Đăng kí</Button></Cell>
                    </Grid>
                </Cell>

                <Cell size={4}></Cell>
            </Grid>
        );
    }
};

export default Login;