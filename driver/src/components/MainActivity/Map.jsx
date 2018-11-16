/* eslint-disable no-undef */
import _ from 'lodash'
import React from 'react'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  SearchBox,
  InfoWindow, Circle, DirectionsRenderer
} from "react-google-maps"
import { compose, withProps } from 'recompose'
import { UpdateLocation } from './api.js'
import { Socket } from '../Config/config.js'
const generateMaker = (drivers, onDragEnd) =>
  drivers.map(({ location, _id }, index) => {
    return <Marker
      key={index}
      position={location}
      defaultVisible={true}
      icon={{
        url: '/bike.png',
        scaledSize: new google.maps.Size(50, 50)
      }}
      draggable={true}
      onDragEnd={onDragEnd(_id)}
    />
  })
class Map extends React.Component {
  constructor() {
    super()
    this.state = {
      map: null,
      direction: null,
      infor: null,
      directionsService: new google.maps.DirectionsService,
      geocoder: new google.maps.Geocoder
    }
    this.updateInfor = this.updateInfor.bind(this)
    this.updateDriverPosition = this.updateDriverPosition.bind(this)
  }
  updateDriverPosition(marker, id) {
    const { updateDriver, socket } = this.props
    const { geocoder } = this.state
    const location = JSON.stringify(marker.latLng)
    UpdateLocation(location, id)
      .then(response => {
        socket.emit(Socket.Driver.DRIVER_MOVE, response.data.message)
        updateDriver(response)
        this.updateInfor(this.state.geocoder, marker.latLng)
          .then(response => {
            this.setState({
              ...this.state,
              infor: response
            })
          }).catch(err => {
            throw err
          })
        // this.props.fetchDriver()
      })
      .catch(err => {
        throw err
      })
  }
  getDirection(driver, point, service) {
    return new Promise((resolve, reject) => {
      let request = {
        origin: new google.maps.LatLng(point),
        destination: new google.maps.LatLng(driver),
        travelMode: 'DRIVING'
      }
      service.route(request, function (result, status) {
        if (status == 'OK') {
          resolve(result)
        } else {
          reject("Loi roi anh oiiiiiiiiiii")
        }
      })
    })
  }
  componentWillReceiveProps(nextProps) {
    const driver = nextProps.driver && nextProps.driver.location
    const point = nextProps.point && nextProps.point.location
    console.log(driver, point)
    const { directionsService } = this.state
    if (driver && point) {
      this.getDirection(driver, point, directionsService)
        .then(direction => {
          this.setState({ ...this.state, direction })
        })
        .catch(err => {
          throw err
        })
    } else {
      this.setState({
        ...this.state,
        direction: null,
      })
    }
  }
  updateInfor(geocoder, location) {
    return new Promise((resolve, reject) => {
      geocoder.geocode({ 'location': location }, function (results, status) {
        if (status === 'OK') {
          if (results[0]) {
            console.log("result0", results[0])
            resolve(results[0].formatted_address)
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      })
    })
  }
  componentDidMount() {
    const { geocoder } = this.state
    this.updateInfor(geocoder, this.props.driver.location)
      .then(response => {
        this.setState({
          ...this.state,
          infor: response
        })
      })
      .catch(err => {
        throw err
      })
  }
  onMapLoad(map) {
    if (this.state.map === null) {
      this.setState({
        ...this.state,
        map
      })
    }
  }
  render() {
    const { driver, point } = this.props
    console.log("this.props", this.props)
    const user = point && point.location && point.location
    const { direction, infor } = this.state
    const location = driver.location && driver.location
    return (
      <div>
        {
          Object.keys(driver).length > 0 ?
            <GoogleMap
              defaultZoom={15}
              center={location}
              ref={this.onMapLoad.bind(this)}
            >
              <Marker
                position={location}
                defaultVisible={true}
                name="name"
                icon={{
                  url: '/bike.png',
                  scaledSize: new google.maps.Size(50, 50),
                  anchor: new google.maps.Point(30, 30)
                }}
                draggable={true}
                onDragEnd={(marker) => {
                  this.updateDriverPosition(marker, driver._id)
                }}
              >
                <InfoWindow><div>{infor}</div></InfoWindow>
              </Marker>
            </GoogleMap >
            : <h2>Loading</h2>
        }
        {
          direction && <DirectionsRenderer
            directions={direction}
            options={{
              suppressMarkers: true
            }}
          />
        }
        {
          user && <Marker
            position={user}
            defaultVisible={true}
            name="name"
            icon={{
              url: '/image/user.png',
              scaledSize: new google.maps.Size(50, 50),
              anchor: new google.maps.Point(30, 30)
            }}
          >
            <InfoWindow><div>
              <span style={{ color: "green" }}>Đ/c: </span>{point.address}
              <br/>
              <span style={{ color: "green" }}>Tên: </span>{point.name}
              <br/>
              <span style={{ color: "green" }}>SĐT: </span>{point.phone}
            </div></InfoWindow>
          </Marker>
        }
      </div>
    )


  }
}
const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyCScHlkcWZyzl7P0MfNYutchAEzoSzAUgU&libraries=geometry,drawing,places&sensor=false",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `520px` }} />,
    mapElement: <div style={{ height: `100%`, width: "930px" }} />,
  }),
  withScriptjs,
  withGoogleMap
)(Map)
export default MyMapComponent