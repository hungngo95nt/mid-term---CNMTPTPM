import React from 'react';
import MyMapComponent from './Map'
import {
    Grid, Cell, ExpansionPanel, Paper, TextField, FontIcon,
    ExpansionList, TabsContainer, Tabs, Tab, Button, SelectField
} from 'react-md'
import Clock from 'react-countdown-clock'
import { UpdateStatus } from './api.js'
import {Socket} from '../Config/config.js'
class LeftActivity extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isMarkerShown: false,
        }
    }
    onPick() {
        const { point,socket } = this.props
        UpdateStatus(point._id, {status:"moving"})
        .then(response=>{
            socket.emit("UPDATE","OK")        
        })
        .catch(err=>{
            throw err
        })
    }
    onDrop() {
        const { locater,driver,updatePoint ,socket,point} = this.props
        UpdateStatus(point._id, { status: "finish", driver_id: driver._id})
        .then(response=>{
            socket.emit("UPDATE","OK")
        })
        .catch(err=>{
            throw err
        })
        updatePoint(null)
        const data={
            driver:driver,
            locater:locater
        }
        socket.emit(Socket.Driver.DRIVER_FINISH,data)
    }
    render() {
        // const { address = "", name = "", phone = "", type = "", note = "" } = this.props.location
        const point = this.props.point && this.props.point
        return (
            <Grid>
                <Cell size={8} phoneSize={12}>
                    <TextField
                        label="Địa chỉ khách:"
                        value={point ? point.address : ""}
                        disabled
                        leftIcon={<FontIcon>add_location</FontIcon>}
                    />
                </Cell>
                <Cell size={4} phoneSize={12}>
                    <TextField
                        label="Loại xe:"
                        disabled
                        value={point ? point.type : ""}
                        leftIcon={<FontIcon>directions_bike</FontIcon>}
                    />
                </Cell>
                <Cell size={12} phoneSize={12}>
                    <TextField
                        label="Ghi chú:"
                        value={point ? point.note : ""}
                        disabled
                        leftIcon={<FontIcon>note</FontIcon>}
                    />
                </Cell>
                <Cell size={12} phoneSize={12}>
                    <TextField
                        label="Số điện thoại:"
                        value={point ? point.phone : ""}
                        disabled
                        leftIcon={<FontIcon>note</FontIcon>}
                    />
                </Cell>
                <Cell size={6}>
                    <Button
                        disabled={!point}
                        raised
                        primary
                        onClick={this.onPick.bind(this)}
                        swapTheming
                    >Đón Khách</Button>
                </Cell>
                <Cell size={6}>
                    <Button
                        raised
                        onClick={this.onDrop.bind(this)}
                        disabled={!point}
                        primary
                        swapTheming
                    >Trả khách</Button>
                </Cell>

            </Grid>

        )
    }
};

export default LeftActivity;