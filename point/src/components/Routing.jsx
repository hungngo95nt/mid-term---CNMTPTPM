import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { withRouter } from 'react-router-dom';
import { Link, Route, Switch } from 'react-router-dom';
import { Button, Drawer, Toolbar } from 'react-md';
import { Home, About, CallHistory, Login, Profile, Register } from './'
import axios from 'axios'
import NavItemLink from './NavItemLink'
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
      isLogged: false
    }
    this.changeStatus = this.changeStatus.bind(this)
  }

  componentDidMount() {
    // Need to set the renderNode since the drawer uses an overlay
    const isLogged = localStorage.getItem('isLogged')
    if (isLogged === 'true') {
      this.setState({ ...this.state, isLogged: true })
    }
    this.dialog = document.getElementById('drawer-routing-example-dialog');
  }
  changeStatus(status) { this.setState(...this.state, { isLogged: status }) }
  showDrawer = () => {
    this.setState({ visible: true });
  };

  // hideDrawer = () => {
  //   this.setState({ visible: false });
  // };

  handleVisibility = (visible) => {
    this.setState({ visible });
  };

  render() {
    const { location } = this.props
    const _user = JSON.parse(localStorage.getItem("user"))
    const { visible, isLogged } = this.state;
    return (
      <div>
        {
          !isLogged ? <Toolbar colored fixed title="Đăng nhập" /> :

            <Toolbar colored fixed title={`Hello ${_user.name}`} nav={<Button icon onClick={this.showDrawer}>menu</Button>} />
        }

        <CSSTransitionGroup
          component="div"
          transitionName="md-cross-fade"
          transitionEnterTimeout={100}
          transitionLeave={false}
        >
          <div style={{ marginTop: "64px" }}>
            <Switch key={location.pathname}>
              <Route path='/' exact render={() => <Home isLogged={isLogged} {...this.props} changeStatus={this.changeStatus} />} />
              <Route path='/register' component={Register} />
              <Route path='/history' render={() => <CallHistory isLogged={isLogged} {...this.props} changeStatus={this.changeStatus} />} />
              <Route path='/about' render={() => <About isLogged={isLogged} {...this.props} changeStatus={this.changeStatus} />} />
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