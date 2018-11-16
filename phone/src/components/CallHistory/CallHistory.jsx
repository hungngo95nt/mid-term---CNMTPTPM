import React from 'react';
import MyMapComponent from '../Map/Map'
import {
    Grid, Cell, ExpansionPanel,
    ExpansionList, TabsContainer, Tabs, Tab
} from 'react-md'
class CallHistory extends React.PureComponent {
    state = {
        isMarkerShown: false,
    }

    componentDidMount() {
        this.delayedShowMarker()
    }

    delayedShowMarker = () => {
        setTimeout(() => {
            this.setState({ isMarkerShown: true })
        }, 3000)
    }

    handleMarkerClick = () => {
        this.setState({ isMarkerShown: false })
        this.delayedShowMarker()
    }

    render() {
        return (
            <Grid style={{ padding: "0px", margin: "0px" }} className="force-overflow">
                <Cell size={4} phoneSize={12} style={{ padding: "10px", margin: "0px" }} className="scrollbar" id="style-1">
                        <ExpansionList>
                            <ExpansionPanel
                                label="Lý Thành Nhân!"
                                secondaryLabel="183 227 Nguyễn Văn Cừ"
                            >
                                <div>'Xe thượng hạng trai đẹp 6  múi'</div>
                            </ExpansionPanel>
                            <ExpansionPanel
                                label="Lý Thành Nhân!"
                                secondaryLabel="183 227 Nguyễn Văn Cừ"
                            >
                                <div>'Xe thượng hạng trai đẹp 6  múi'</div>
                            </ExpansionPanel>
                            <ExpansionPanel
                                label="Lý Thành Nhân!"
                                secondaryLabel="183 227 Nguyễn Văn Cừ"
                            >
                                <div>'Xe thượng hạng trai đẹp 6  múi'</div>
                            </ExpansionPanel>
                            <ExpansionPanel
                                label="Lý Thành Nhân!"
                                secondaryLabel="183 227 Nguyễn Văn Cừ"
                            >
                                <div>'Xe thượng hạng trai đẹp 6  múi'</div>
                            </ExpansionPanel>
                            <ExpansionPanel
                                label="Lý Thành Nhân!"
                                secondaryLabel="183 227 Nguyễn Văn Cừ"
                            >
                                <div>'Xe thượng hạng trai đẹp 6  múi'</div>
                            </ExpansionPanel>
                        </ExpansionList>
                </Cell>
                <Cell size={8} style={{ padding: "0px", margin: "0px" }}>
                    <MyMapComponent
                        isMarkerShown={this.state.isMarkerShown}
                        onMarkerClick={this.handleMarkerClick}
                    />
                </Cell>
            </Grid >
        )
    }
};

export default CallHistory;