import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { withRouter } from 'react-router-dom';
import { Link, Route, Switch } from 'react-router-dom';
import { Button, Drawer, Toolbar } from 'react-md';
import { Home, About, CallHistory, Login, Profile, Register } from './'
import { Client } from './Config/config.js'
import { GetMe } from './api.js'
import NavItemLink from './NavItemLink'
import { Socket } from './Config/config.js'
import Notifications from "react-web-notification"
const navItems = [{
  label: 'Home',
  to: '/',
  component: Home,
  exact: true,
  icon: 'inbox',
}, {
  label: 'Profile',
  component: Profile,
  to: `/profile`,
  icon: 'star',
}, {
  label: 'History',
  component: CallHistory,
  to: `/history`,
  icon: 'send',
}, {
  label: 'About',
  component: About,
  to: `/about`,
  icon: 'drafts',
}];

class Routing extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
  };
  constructor() {
    super()
    this.state = {
      visible: false,
      isLogged: false,
      driver: null,
      ask: false,
      point: null,
      locater: null,
      socket: null
    }
    this.changeStatus = this.changeStatus.bind(this)
  }
  onAccept() {
    const { socket, point, driver, locater } = this.state
    const payload = {
      point, driver, locater
    }
    socket.emit(Socket.Driver.DRIVER_ACCEPT, payload)
    this.setState({ ...this.state, ask: false })
  }
  onDenied() {
    const { socket, driver } = this.state
    socket.emit(Socket.Driver.DRIVER_DENIED, driver._id)
    this.setState({ ...this.state, ask: false, locater: null, point: null })
  }
  onHide() {
    const { socket, driver } = this.state
    socket.emit(Socket.Driver.DRIVER_DENIED, driver._id)
    this.setState({ ...this.state, point: null, locater: null, ask: false })
  }
  componentDidMount() {
    // Need to set the renderNode since the drawer uses an overlay
    const isLogged = localStorage.getItem('isLogged')
    const socket = io.connect('http://localhost:8000')
    if (isLogged === 'true') {
      GetMe(localStorage.getItem('token'))
        .then(response => {
          localStorage.setItem('user', JSON.stringify(response.data.message))
          socket.emit(Client.DRIVER, response.data.message.email)
          this.setState(...this.state, { driver: response.data.message, isLogged, socket })
        })
        .catch(err => {
          throw err
        })
    } else {
      this.setState(...this.state, { socket })
    }
    socket.on(Socket.Locate.PAIR, (data) => {
      this.setState({
        ...this.state,
        point: data.point,
        locater: data.locater,
        ask: true
      })
    })
    socket.on(Socket.Locate.DIRECT_PAIR, (data) => {
      console.log("driver_payload",data)
      this.setState({
        ...this.state,
        point: data,
        locater: data.locater,
        ask: true
      })
    })
    socket.on(Socket.Driver.DRIVER_MOVE, (driver) => {
      this.setState({ ...this.state, driver })
    })

    this.dialog = document.getElementById('drawer-routing-example-dialog');
  }
  changeStatus(driver) { this.setState({ ...this.state, isLogged: true, driver }) }
  updatePoint(point) { this.setState({ ...this.state, point }) }
  updateDriver(driver) { this.setState({ ...this.state, driver }) }
  showDrawer = () => {
    this.setState({ visible: true });
  };

  // hideDrawer = () => {
  //   this.setState({ visible: false });
  // };
  changeAsk = (status) => this.setState({ ...this.state, ask: status })
  handleVisibility = (visible) => {
    this.setState({ visible });
  };
  handlePermissionGranted() {
    console.log('Permission Granted');
    this.setState({
      ignore: false
    });
  }
  handlePermissionDenied() {
    console.log('Permission Denied');
    this.setState({
      ignore: true
    });
  }
  handleNotSupported() {
    console.log('Web Notification not Supported');
    this.setState({
      ignore: true
    });
  }

  handleNotificationOnClick(e, tag) {
    console.log(e, 'Notification clicked tag:' + tag);
  }

  handleNotificationOnError(e, tag) {
    console.log(e, 'Notification error tag:' + tag);
  }

  handleNotificationOnClose(e, tag) {
    console.log(e, 'Notification closed tag:' + tag);
  }

  handleNotificationOnShow(e, tag) {
    // this.playSound();
    console.log(e, 'Notification shown tag:' + tag);
  }
  render() {
    const { location } = this.props;
    console.log("after", this.state)
    const _user = JSON.parse(localStorage.getItem("user"))
    const { visible, isLogged, driver, point } = this.state;
    const options = {
      tag: "New Address receiver",
      body: point && point.address,
      icon: "/image/user.png",
      lang: 'en',
      dir: 'ltr',
      sound: './sound.mp3'  // no browsers supported https://developer.mozilla.org/en/docs/Web/API/notification/sound#Browser_compatibility
    }
    return (
      <div>
        {
          !isLogged ? <Toolbar colored fixed title="Đăng nhập" /> :
            <Toolbar colored fixed title={`Hello ${_user.name}`} nav={<Button icon onClick={this.showDrawer}>menu</Button>} />
        }
        {
          point ?
            <Notifications
              ignore={!point}
              notSupported={this.handleNotSupported.bind(this)}
              onPermissionGranted={this.handlePermissionGranted.bind(this)}
              onPermissionDenied={this.handlePermissionDenied.bind(this)}
              onShow={this.handleNotificationOnShow.bind(this)}
              onClick={this.handleNotificationOnClick.bind(this)}
              onClose={this.handleNotificationOnClose.bind(this)}
              onError={this.handleNotificationOnError.bind(this)}
              timeout={3000}
              title={"Có khách kìa đại ca <3!"}
              options={options}
            /> : ""
        }

        <CSSTransitionGroup
          component="div"
          transitionName="md-cross-fade"
          transitionEnterTimeout={100}
          transitionLeave={false}
        >
          <div style={{ marginTop: "64px" }}>
            <Switch key={location.pathname}>
              <Route path='/' exact render={() =>
                <Home
                  {...this.state} {...this.props}
                  changeStatus={this.changeStatus}
                  updatePoint={this.updatePoint.bind(this)}
                  changeAsk={this.changeAsk.bind(this)}
                  onAccept={this.onAccept.bind(this)}
                  onDenied={this.onDenied.bind(this)}
                  onHide={this.onHide.bind(this)}
                  updateDriver={this.updateDriver.bind(this)} />
              } />
              <Route path='/register' component={Register} />
              <Route path='/history' render={() => <CallHistory {...this.state} {...this.props} changeStatus={this.changeStatus} />} />
              <Route path='/about' render={() => <About {...this.state} {...this.props} changeStatus={this.changeStatus} />} />
            </Switch>
          </div>
        </CSSTransitionGroup>
        <Drawer
          type={Drawer.DrawerTypes.TEMPORARY}
          visible={visible}
          onVisibilityChange={this.handleVisibility}
          header={<Toolbar title={<Link to="/">Thao tác</Link>} />}
          renderNode={this.dialog}
          navItems={navItems.map(props => <NavItemLink {...props} key={props.to} />)}
        />
      </div>
    );
  }
}
export default withRouter(Routing);