import React from 'react';
import { Grid, Cell, TextField, Button, Avatar } from 'react-md'

const style = {
    marginTop: "100px"
}
const text = {
    fontSize: "50px"
}
const imageStyle={
    position: "relative",
    left: "40%",

}
const Login = () => {
    console.log("login")
    return (
        <Grid style={style}>
            <Cell size={4}></Cell>
            <Cell size={4}>
                <img src='image/user.png' style={imageStyle} width="100px" role="presentation" />
                <TextField value="" id="username" type="email" label="Email or Username" customSize={22} style={{ marginTop: "20px" }} />
                <TextField value="" id="password" type="password" label="Password" customSize={22} style={{ marginTop: "20px" }} />
                <Grid>
                    <Cell size={4}><Button flat  primary swapTheming>Đăng nhập</Button></Cell>
                    <Cell size={8} ><Button flat secondary swapTheming>Đăng kí</Button></Cell>
                </Grid>
            </Cell>

            <Cell size={4}></Cell>
        </Grid>
    );
};

export default Login;