import React from 'react'
import Notifier from 'react-notification-system'
import { Login,MainActivity } from '../'
import Notification from 'react-web-notification'
class Home extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ignore: true,
            title: ''
        };
    }
    
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

    playSound(filename) {
        //  document.getElementById('sound').play();
    }

    handleButtonClick() {
        if (this.state.ignore) {
            return;
        }


        const title = 'React-Web-Notification';
        const body = 'THIS IS BODY';
        const tag = "THIS IS TAG"
        const icon = 'http://georgeosddev.github.io/react-web-notification/example/Notifications_button_24.png';
        // const icon = 'http://localhost:3000/Notifications_button_24.png';

        // Available options
        // See https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification
        const options = {
            tag: tag,
            body: body,
            icon: icon,
            lang: 'en',
            dir: 'ltr',
            // sound: './sound.mp3'  // no browsers supported https://developer.mozilla.org/en/docs/Web/API/notification/sound#Browser_compatibility
        }
        this.setState({
            title: title,
            options: options
        });
    }

    render() {
        const {isLogged,changeStatus} = this.props
        return (
            <div>
                {isLogged ? <MainActivity /> : <Login {...this.props.location} changeStatus={changeStatus}/>}
            </div>
        )
    }
};

export default Home;