import React, { Component } from 'react';
import { Grid, Cell, Paper, TextField, Button, SelectField } from 'react-md'
import { PostAddress } from './api.js'
import { Socket } from '../Config/config.js'
import Table from './Table'
import axios from 'axios'
class MainActivity extends Component {
    constructor() {
        super()
        this.state = {
            address: "",
            type: "",
            phone: "",
            name: "",
            note: "",
            locations: [],
            _filters: []
        }
        this.onTextChange = this.onTextChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onTypeChange = this.onTypeChange.bind(this)
    }
    onTypeChange(value, index, e) {
        const { address, type, phone, note, name, locations } = this.state
        let new_locations = locations
        if (address) {
            new_locations = new_locations.filter(item => item['address'].includes(address) && item)
        }
        if (phone) {
            new_locations = new_locations.filter(item => item['phone'].includes(phone) && item)
        }
        if (name) {
            new_locations = new_locations.filter(item => item['name'].includes(name) && item)
        }
        if (note) {
            new_locations = new_locations.filter(item => item['note'].includes(note) && item)
        }
        new_locations = new_locations.filter(item => item['type'] === value && item)
        this.setState({
            ...this.state,
            [e.target.name]: value,
            _filters: [...new_locations],
            type: value

        })
    }
    componentDidMount() {
        axios.get('http://localhost:8080/locates')
            .then(response => {
                console.log("response", response.data.message)
                this.setState({
                    ...this.state,
                    locations: response.data.message,
                    _filters: response.data.message
                })
            })

    }
    onTextChange(value, e) {
        const { address, type, phone, note, name, locations } = this.state
        let new_locations = locations
        if (address && e.target.name != "address") {
            new_locations = new_locations.filter(item => item['address'].includes(address) && item)
        }
        if (type && e.target.name != "type") {
            new_locations = new_locations.filter(item => item['type'] === type && item)
        }
        if (phone && e.target.name != "phone") {
            new_locations = new_locations.filter(item => item['phone'].includes(phone) && item)
        }
        if (name && e.target.name != "name") {
            new_locations = new_locations.filter(item => item['name'].includes(name) && item)
        }
        if (note && e.target.name != "note") {
            new_locations = new_locations.filter(item => item['note'].includes(note) && item)
        }
        new_locations = new_locations.filter(item => item[e.target.name].includes(value) && item)
        this.setState({
            ...this.state,
            [e.target.name]: value,
            _filters: [...new_locations]
        })
    }
    onSubmit() {
        const { address, type, phone, note, name, locations } = this.state
        PostAddress(localStorage.getItem('token'), { address, type, phone, note, name })
            .then(response => {
                const { socket } = this.props
                socket.emit(Socket.Phone.NEW_ADDRESS, response.data.message)
                this.setState({
                    address: "",
                    type: "",
                    phone: "",
                    name: "",
                    note: "",
                    locations: [
                        ...this.state.locations,
                        response.data.message
                    ]
                })
            })
            .catch(err => {
                console.error(err)
            })
    }
    directSend(location) {
        const { socket } = this.props
        console.log("emit", location)
        socket.emit(Socket.Locate.DIRECT_PAIR, location)
    }
    render() {
        const { phone, name, address, note, type } = this.state
        return (
            <Grid>
                <Cell size={4}>
                    <Paper style={{ padding: "20px" }}>
                        <h4>Nhận khách</h4>
                        <hr />
                        <Grid>
                            <Cell size={8}>
                                <TextField
                                    id="text-with-close-button"
                                    label="Địa chỉ*"
                                    name="address"
                                    value={address}
                                    onChange={this.onTextChange}
                                />
                            </Cell>
                            <Cell size={4}>
                                <SelectField
                                    id="select-field-2"
                                    label="Loại xe"
                                    placeholder="Chọn loại xe"
                                    block={true}
                                    value={type}
                                    name="type"
                                    onChange={this.onTypeChange}
                                    menuItems={["premium", "normal"]}
                                    simplifiedMenu={true}
                                />
                            </Cell>
                        </Grid>
                        <Grid>
                            <Cell size={6}>
                                <TextField
                                    id="text-with-close-button"
                                    onChange={this.onTextChange}
                                    name="phone"
                                    value={phone}
                                    label="Số điện thoại*"
                                />
                            </Cell>
                            <Cell size={6}>
                                <TextField
                                    id="text-with-close-button"
                                    onChange={this.onTextChange}
                                    name="name"
                                    value={name}
                                    label="Họ tên"
                                />
                            </Cell>
                        </Grid>
                        <Grid>
                            <Cell size={12}>
                                <TextField
                                    id="text-with-close-button"
                                    onChange={this.onTextChange}
                                    name="note"
                                    value={note}
                                    label="Ghi chú"

                                />
                            </Cell>
                            <label htmlFor="">* bắt buộc</label>
                        </Grid>
                        <Grid>
                            <Button raised primary swapTheming onClick={this.onSubmit}>Gửi</Button>
                        </Grid>
                    </Paper>
                </Cell>
                <Cell size={8}>
                    <Paper style={{ padding: "20px" }}>
                        <h4>Lịch sử cuộc gọi:</h4>
                        <hr />
                        <Table
                            data={this.state._filters.reverse()}
                            pair={this.directSend.bind(this)}
                        />
                    </Paper>

                </Cell>
            </Grid>
        );
    }
}

export default MainActivity;