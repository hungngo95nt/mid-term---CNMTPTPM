import React from 'react';
import { Grid, Cell, TextField, Button, Avatar } from 'react-md'
import { Link } from 'react-router-dom'
import * as API from './api.js'
import {Client} from '../Config/config.js'
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
            err: {},
            isLogged: false
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    componentDidMount() {
        const {location} = this.props
        if (location && location.state) {
            const { from, email, password } = location.state
            if (from === "register") {
                this.setState(...this.state, { email, password })
            }
        }
    }
    onChange(value, e) {
        this.setState({
            ...this.state,
            [e.target.name]: value
        })
    }
    onSubmit() {
        const { email, password } = this.state
        const {socket} = this.props
        console.log("spcket",socket)
        API.Login(email, password)
            .then(response => {
                const { data } = response
                if (data.status === 200) {
                    localStorage.setItem("token", data.message.token)
                    localStorage.setItem("user",JSON.stringify(data.message.user))
                    localStorage.setItem("isLogged", "true")
                    socket.emit(Client.DRIVER,data.message.user.email)
                    this.props.changeStatus(true,data.message.user)
                }
            })
            .catch(err => {
                throw err
                this.setState(...this.state, { err: err.response.data })
            })
    }
    render() {
        const { email, password } = this.state
        return (
            <Grid style={style}>
                <Cell size={4}></Cell>
                <Cell size={4}>
                    <img src='image/user.png' style={imageStyle} width="100px" role="presentation" />
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
                    <Grid>
                        <Cell size={4}><Button flat primary swapTheming onClick={this.onSubmit}>Đăng nhập</Button></Cell>
                        <Cell size={8} ><Link to="/register"><Button flat secondary swapTheming >Đăng kí</Button></Link></Cell>
                    </Grid>
                </Cell>

                <Cell size={4}></Cell>
            </Grid>
        );
    }
};

export default Login;