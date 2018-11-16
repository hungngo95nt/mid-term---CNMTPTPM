import React from 'react';
import MyMapComponent from './Map'
import {
    Grid, Cell, ExpansionPanel, Paper, TextField, FontIcon,
    ExpansionList, TabsContainer, Tabs, Tab, Button, SelectField,DialogContainer
} from 'react-md'
import Clock from 'react-countdown-clock'
class LeftActivity extends React.PureComponent {
    state = {
        isMarkerShown: false,
    }
    onRadiusChange(value, index, e) {
        value = value === "Tất cả" ? 0 : value
        this.props.updateRadius(value)
    }
    render() {
        const { pairDriverUser, location, closer_driver, radius } = this.props
        const driver_name = closer_driver && closer_driver.driver && closer_driver.driver.name || ""
        const driver_email = closer_driver && closer_driver.driver && closer_driver.driver.email || ""
        const { address = "", name = "", phone = "", type = "", note = "" } = location
        return (
            <div>
                <ExpansionList>
                    <ExpansionPanel
                        label="Địa chỉ khách" footer={null}
                        defaultExpanded={true}
                    >
                        <Grid>
                            <Cell size={8}>
                                <TextField
                                    id="disabled-floating-label-multiline-field"
                                    label="Địa chỉ khách:"
                                    value={address}
                                    disabled
                                    leftIcon={<FontIcon>add_location</FontIcon>}
                                />
                            </Cell>
                            <Cell size={4}>
                                <TextField
                                    id="disabled-floating-label-multiline-field"
                                    label="Loại xe:"
                                    disabled
                                    value={type}
                                    leftIcon={<FontIcon>directions_bike</FontIcon>}
                                />
                            </Cell>
                        </Grid>
                        <Grid>
                            <Cell size={6}>
                                <TextField
                                    id="disabled-floating-label-multiline-field"
                                    label="SĐT:"
                                    disabled
                                    value={phone}
                                    leftIcon={<FontIcon>phone</FontIcon>}
                                />
                            </Cell>
                            <Cell size={6}>
                                <TextField
                                    id="disabled-floating-label-multiline-field"
                                    label="Tên:"
                                    value={name}
                                    disabled
                                    leftIcon={<FontIcon>accessibility</FontIcon>}
                                />
                            </Cell>
                        </Grid>
                        <Cell size={12}>
                            <TextField
                                id="disabled-floating-label-multiline-field"
                                label="Ghi chú:"
                                disabled
                                value={"note"}
                                leftIcon={<FontIcon>note</FontIcon>}
                            />
                        </Cell>
                    </ExpansionPanel>
                    <ExpansionPanel
                        label="Tài xế" footer={null}
                        defaultExpanded={true}
                    >
                        <Grid>
                            <Cell size={12}>
                                <SelectField
                                    id="select-field-2"
                                    label="Bán kính"
                                    placeholder="Chọn bán kính"
                                    block={true}
                                    value={radius}
                                    onChange={this.onRadiusChange.bind(this)}
                                    name="radius"
                                    menuItems={["Tất cả", 600, 800, 1000]}
                                    simplifiedMenu={true}
                                />
                            </Cell>
                        </Grid>
                        <Grid>
                            <Button
                                raised
                                primary
                                swapTheming
                                onClick={() => {
                                    pairDriverUser()
                                }}
                            >Ghép tài xế</Button>
                        </Grid>
                        <Cell size={12}>
                            <TextField
                                id="disabled-floating-label-multiline-field"
                                label="Ghi chú:"
                                value={" "}
                                disabled
                                leftIcon={<FontIcon>note</FontIcon>}
                            />
                        </Cell>
                    </ExpansionPanel>
                </ExpansionList>
            </div>
        )
    }
};

export default LeftActivity;