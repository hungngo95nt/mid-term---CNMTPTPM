import React, { Component } from 'react';
import {
    DataTable,
    TableHeader,
    TableBody,
    TableRow,
    TableColumn,
    TablePagination,
    Button, DialogContainer, Toolbar
} from 'react-md';
const headers = ["Address", "Date", "Username", "Phone", "Type", "Status", "Actions"];
class DataTables extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            start: 0,
            rowsPerPage: 10,
            visible: false,
            pageX: null,
            pageY: null,
            center: null,
            driver: null
        }
    }
    show = (e, center, driver) => {
        let { pageX, pageY } = e;
        if (e.changedTouches) {
            pageX = e.changedTouches[0].pageX;
            pageY = e.changedTouches[0].pageY;
        }
        this.setState({ ...this.state, visible: true, pageX, pageY });
    };

    hide = () => {
        this.setState({ visible: false });
    };
    handlePagination = (start, rowsPerPage) => {
        this.setState({ start, rowsPerPage });
    }
    render() {
        const { data } = this.props
        const { start, rowsPerPage,
            visible, pageX, pageY } = this.state
        const slicedData = data.slice(start, start + rowsPerPage)
        const rows = data.length
        return (
            <div>
                <DataTable baseId="simple-pagination">
                    <TableHeader>
                        <TableRow selectable={false}>
                            {headers.map(header => <TableColumn key={header}>{header}</TableColumn>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {slicedData.map((item) => (
                            <TableRow key={item._id} selectable={false}>
                                <TableColumn>{item.address}</TableColumn>
                                <TableColumn>{new Date(item.created_at).toLocaleDateString()}</TableColumn>
                                <TableColumn>{item.name}</TableColumn>
                                <TableColumn>{item.phone}</TableColumn>
                                <TableColumn>{item.type}</TableColumn>
                                <TableColumn>{item.status}</TableColumn>
                                <TableColumn>{item.status === "finish" ?
                                    <Button
                                        flat
                                        secondary
                                        swapTheming
                                        onClick={()=>this.props.pair(item)}
                                    >Send</Button> : "None"
                                }</TableColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TablePagination rows={rows} onPagination={this.handlePagination} />
                </DataTable>
            </div>
        );
    }
}

export default DataTables;