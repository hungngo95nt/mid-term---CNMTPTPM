import React from 'react';
import MyMapComponent from './Map'
import {
    Grid, Cell, ExpansionPanel,
    ExpansionList, TabsContainer, Tabs, Tab, SelectField
} from 'react-md'
import { fetchData } from './api.js'
import DataTable from './DataTable'
import io from 'socket.io-client'


const View = {
    NEW: "New Address",
    LOCATING: "Locating Address",
    PAIRED: "Pairing Address",
    MOVING: "Moving Address",
    DROP: "Droped Address"
}
const Status = {
    "New Address": "new",
    "Locating Address": "locating",
    "Pairing Address": "paired",
    "Moving Address": "moving",
    "Droped Address": "finish"
}
class MainActivity extends React.PureComponent {
    state = {
        isMarkerShown: false,
        value: "",
        view: View.NEW,
        data: []
    }
    componentDidMount() {
        const socket = io.connect('http://localhost:8000')
        socket.on("UPDATE", payload => {
            console.log("update")
            fetchData()
                .then(response => {
                    this.setState({
                        ...this.state,
                        data: response.data.message
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        })
        socket.emit('point',"HELLO")
        fetchData()
            .then(response => {
                this.setState({
                    ...this.state,
                    data: response.data.message
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    onSeclectChange(value, index, e) {
        fetchData()
            .then(response => {
                this.setState({
                    ...this.state,
                    view: value,
                    data: response.data.message
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    render() {
        const { view, data } = this.state
        const filterData = data.filter(item => item.status === Status[view] && item)
        console.log("filter", filterData)
        return (
            <Grid style={{ paddingLeft: "100px", paddingRight: "100px", margin: "0px" }} className="force-overflow">
                <Cell size={8}>
                    <h4 className="md-cell md-cell--12">Thao tác :</h4>
                    <SelectField
                        id="select-field-4"
                        placeholder="Numbers button"
                        className="md-cell"
                        value={view}
                        menuItems={[
                            "New Address",
                            "Locating Address",
                            "Pairing Address",
                            "Moving Address",
                            "Droped Address"
                        ]}
                        position={SelectField.Positions.BELOW}
                        onChange={this.onSeclectChange.bind(this)}
                    />
                </Cell>
                <Cell size={12}>
                    <DataTable
                        data={filterData.reverse()}
                    />
                </Cell>
            </Grid >
        )
    }
};

export default MainActivity;