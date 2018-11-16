import React from 'react';
import MyMapComponent from './Map'
import {
    Grid, Cell, ExpansionPanel, Paper, TextField, FontIcon,
    ExpansionList, TabsContainer, Tabs, Tab, Button, DialogContainer
} from 'react-md'
import Clock from 'react-countdown-clock'
import LeftActivity from './LeftActivity'
import { Socket } from '../Config/config.js'
import { GetDrivers } from './api.js'
class MainActivity extends React.PureComponent {
    constructor(props) {
        super(props)
    }
    onExpandToggle(expanded) {
        console.log(expanded)
    }
    componentWillReceiveProps(nextProps) {
        const { changeAsk, ask } = this.props
        // this.notify()
    }
    render() {
        const { ask, changeAsk, onAccept, onDenied, onHide } = this.props
        const actions = [];
        actions.push({ secondary: true, children: 'Cancel', onClick: onDenied });
        actions.push(<Button flat primary onClick={onAccept}>Confirm</Button>);
        const compress = { ...this.state, ...this.props }
        return (
            <Grid style={{ padding: "0px", margin: "0px" }} className="force-overflow">
                <DialogContainer
                    id="simple-action-dialog"
                    visible={ask}
                    onHide={onHide}
                    actions={actions}
                    title="Khách hàng đang cần bạn!"
                >
                    <Grid>
                        <Cell size={12}>
                            <TextField
                                id="disabled-floating-label-with-icon"
                                label="Địa chỉ khách"
                                disabled
                                className="md-cell md-cell--bottom"
                                leftIcon={<FontIcon>location_on</FontIcon>}
                            />
                        </Cell>
                        <Cell size={12} style={{ paddingLeft: "25%" }}>
                            <Clock
                                seconds={5}
                                color="#e67e22"
                                alpha={1}
                                size={100}
                                onComplete={onDenied}
                            />
                        </Cell>

                    </Grid>
                </DialogContainer>
                <Cell size={4} phoneSize={12} style={{ padding: "10px", margin: "0px" }} >
                    <LeftActivity
                        {...this.state}
                        {...this.props}
                    />
                </Cell>
                <Cell size={8} phoneSize={12} style={{ padding: "0px", margin: "0px" }}>
                    <MyMapComponent
                        {...this.state}
                        {...this.props}
                    />
                </Cell>
            </Grid >
        )
    }
};

export default MainActivity;