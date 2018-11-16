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
import Map from './Map'
const headers = ["Address", "Date", "Username", "Phone", "Type", "Status", "Action"];
class DataTables extends Component {
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
        this.setState({ ...this.state, visible: true, pageX, pageY, center, driver });
    };

    hide = () => {
        this.setState({ visible: false });
    };
    handlePagination = (start, rowsPerPage) => {
        this.setState({ start, rowsPerPage });
    };
    render() {
        const { data } = this.props
        const { start, rowsPerPage,
            visible, pageX, pageY,
            center, driver } = this.state
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
                        {slicedData.map(({ _id, type, address, phone, name, driver, location, created_at, status }) => (
                            <TableRow key={_id} selectable={false}>
                                <TableColumn>{address}</TableColumn>
                                <TableColumn>{new Date(created_at).toLocaleDateString()}</TableColumn>
                                <TableColumn>{name}</TableColumn>
                                <TableColumn>{phone}</TableColumn>
                                <TableColumn>{type}</TableColumn>
                                <TableColumn>{status}</TableColumn>
                                <TableColumn>{status === "finish" ? <Button onClick={(e) => this.show(e, location, driver)} flat primary swapTheming>View</Button> : "Hi"}</TableColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TablePagination rows={rows} onPagination={this.handlePagination} />
                </DataTable>
                <DialogContainer
                    id="simple-full-page-dialog"
                    visible={visible}
                    pageX={pageX}
                    pageY={pageY}
                    fullPage
                    onHide={this.hide}
                    aria-labelledby="simple-full-page-dialog-title"
                >
                    <Toolbar
                        fixed
                        colored
                        title="Đóng"
                        titleId="simple-full-page-dialog-title"
                        nav={<Button icon onClick={this.hide}>close</Button>}
                    />
                    <section className="md-toolbar-relative">
                        <div>
                            <Map {...this.state}/>
                        </div>
                    </section>
                </DialogContainer>
            </div>
        );
    }
}

export default DataTables;