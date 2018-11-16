/* eslint-disable no-undef */
import _ from 'lodash'
import React from 'react'
import Promise from 'bluebird'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  SearchBox,
  InfoWindow, Circle, DirectionsRenderer
} from "react-google-maps"
import { compose, withProps } from 'recompose'
import { UpdateLocation, UpdateGeocode } from './api.js'
import { Socket } from '../Config/config.js'
const generateMaker = (drivers, onDragEnd) =>
  drivers.map(({ location, _id }, i) => {
    return <Marker
      key={i}
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
      center: {},
      map: null,
      filter_drivers: [],
      filter_drivers_with_dist: [],
      geocoder: new google.maps.Geocoder(),
      closer_driver: null,
      direction: null,
      infor: null,
      directionsService: new google.maps.DirectionsService
    }
    this.updateDriverPosition = this.updateDriverPosition.bind(this)
    this.onUserMove = this.onUserMove.bind(this)
    this.filterDriversWithRadius = this.filterDriversWithRadius.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    const { geocoder, directionsService } = this.state
    const { updateCloserDriver, updateGeoCode, socket } = this.props
    const address = nextProps.location && nextProps.location.address
    const drivers = nextProps.drivers && nextProps.drivers
    const radius = nextProps.radius && nextProps.radius
    let filter_drivers = []
    console.log("receiver,address", address)
    if (address) {
      geocoder.geocode({
        'address': address
      }, (results, status) => {
        if (status === 'OK') {
          let center = results[0].geometry.location
          UpdateGeocode(JSON.parse(JSON.stringify(center)), this.props.location._id)
            .then(response => {
              socket.emit("UPDATE")
              updateGeoCode(response.data.message)
              this.setState({
                ...this.state,
                infor: address
              })
            })
          if (drivers.length > 0) {
            this.filterDriversWithRadius(drivers, radius)
              .then(drivers => {
                filter_drivers = drivers
                let location = null
                if (filter_drivers.length > 0) {
                  return new Promise.map(filter_drivers, (driver) => {
                    location = new google.maps.LatLng(driver.location)
                    return this.calculateDistance(location, center, directionsService)
                      .then(result => {
                        return {
                          ...result,
                          driver,
                          infor: address
                        }
                      })
                      .catch(err => {
                        console.error(err)
                      })
                  })
                } else {
                  updateCloserDriver(null)
                  this.setState({
                    ...this.state,
                    filter_drivers: [],
                    filter_drivers_with_dist: [],
                    infor: address
                  })
                  return {
                    then: function () { }
                  };
                }
              })
              .then(results => {
                const closer = _.minBy(results, (o) => o.dist)
                updateCloserDriver(closer)
                this.setState({
                  ...this.state,
                  center,
                  filter_drivers: [...filter_drivers],
                  filter_drivers_with_dist: [...results],
                })

              })
              .catch(err => {
                console.error(err)
              })
          } else {
            this.setState({ ...this.state, center, infor: address })
          }

        } else {
          console.log("geocodeAddress got errors!")
        }
      })

    } else {
      this.filterDriversWithRadius(drivers, radius)
        .then(drivers => {
          filter_drivers = drivers
          let location = null
          if (filter_drivers.length > 0) {
            return new Promise.map(filter_drivers, (driver) => {
              location = new google.maps.LatLng(driver.location)
              return this.calculateDistance(location, this.state.center, directionsService)
                .then(result => {
                  return {
                    ...result,
                    driver
                  }
                })
                .catch(err => {
                  console.error(err)
                })
            })
          } else {
            updateCloserDriver(null)
            this.setState({
              ...this.state,
              closer_driver: null,
              filter_drivers: [],
              filter_drivers_with_dist: []
            })
            return { then: () => { } }
          }
        })
        .then(results => {
          const closer = _.minBy(results, (o) => o.dist)
          updateCloserDriver(closer)
          this.setState({
            ...this.state,
            filter_drivers_with_dist: [...results],
            filter_drivers: [...filter_drivers],
            closer_driver: closer.result
          })
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
  componentDidMount() {
    const { drivers, socket, updateDrivers } = this.props
    const { filter_drivers } = this.state
    const geocoder = new google.maps.Geocoder()
    socket.on(Socket.Driver.DRIVER_DENIED, (id) => {
      const new_drivers = filter_drivers.filter(driver => driver._id != id && driver)
      updateDrivers(new_drivers)
    })
    this.setState({
      ...this.state,
      center: new google.maps.LatLng({ lat: 10.7625113, lng: 106.6808868 }),
      filter_drivers: [...drivers]
    })
    // DirectionsService.route({
    //   origin: new google.maps.LatLng(10.7626272, 106.6805864),
    //   destination: new google.maps.LatLng(10.7626372, 106.6850864),
    //   travelMode: google.maps.TravelMode.DRIVING,
    // }, (result, status) => {
    //   if (status === google.maps.DirectionsStatus.OK) {
    //     this.setState({
    //       directions: result,
    //     });
    //   } else {
    //     console.error(`error fetching directions ${result}`);
    //   }
    // });
  }
  calculateDistance(driver, center, service) {
    return new Promise((resolve, reject) => {
      let request = {
        origin: center,
        destination: driver,
        travelMode: 'DRIVING'
      }
      service.route(request, function (result, status) {
        if (status == 'OK') {
          const message = {
            dist: result.routes[0].legs[0].distance.value,
            result: result
          }
          resolve(message)
        }
      })
    })
  }
  filterDriversWithRadius(drivers, radius) {
    return new Promise((resolve, reject) => {
      radius = parseFloat(radius)
      if (radius === 0) {
        resolve(drivers)
      } else {
        let updated_drivers = []
        let driver = "", distance = 0
        for (let i in drivers) {
          driver = new google.maps.LatLng({ ...drivers[i].location })
          let distance = parseFloat(google.maps.geometry.spherical.computeDistanceBetween(driver, this.state.center).toFixed(2))
          if (distance <= radius) {
            updated_drivers.push(drivers[i])
          }
        }
        resolve(updated_drivers)
      }
    })
    // updateDrivers(filter_drivers)
  }
  updateDriverPosition(marker, id) {
    const { drivers, updateDrivers, socket } = this.props
    const location = JSON.stringify(marker.latLng)
    UpdateLocation(location, id)
      .then(response => {
        socket.emit(Socket.Driver.DRIVER_MOVE, response.data.message)
        let updated_drivers = drivers.map(driver => {
          if (driver._id === id) {
            driver.location = JSON.parse(location)
          }
          return driver
        })
        updateDrivers(updated_drivers)
        // this.props.fetchDriver()
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
  onBoundsChanged() {
    const { map, center } = this.state
  }
  updateInfor(geocoder, location) {
    return new Promise((resolve, reject) => {
      geocoder.geocode({ 'location': location }, function (results, status) {
        if (status === 'OK') {
          if (results[0]) {
            console.log("result0", results[0])
            resolve(results[0].formatted_address)
          } else {
            console.log("no locaiton found")
          }
        } else {
          console.log("no locaiton found")
        }
      })
    })
  }
  onUserMove(marker) {
    const { geocoder } = this.state
    this.updateInfor(geocoder, marker.latLng)
      .then(response => {
        this.setState({
          ...this.state,
          infor: response
        })
      })
      .catch(err => {
        throw err
      })
    console.log("user move", this.props)
  }
  render() {
    console.log("this.oldstate", this.state)
    const {
      center, infor,
      filter_drivers,
      filter_drivers_with_dist } = this.state
    const { radius, closer_driver, showMarker,location } = this.props
    const direct = closer_driver && closer_driver.result
    return (
      <div>
        {
          Object.keys(center).length > 0 ?
            <GoogleMap
              defaultZoom={15}
              center={center}
              onBoundsChanged={this.onBoundsChanged.bind(this)}
              ref={this.onMapLoad.bind(this)}
            >
              {
                radius !== 0 ?
                  <Circle
                    center={center}
                    radius={radius}
                  /> : null
              }
              {
                filter_drivers.length > 0 ?
                  filter_drivers.map(({ email, location, _id }) => {
                    return <Marker
                      // key={_id}
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
                        this.updateDriverPosition(marker, _id)
                      }}
                    >
                      <InfoWindow><div>{email}
                      </div></InfoWindow>
                    </Marker>
                  })
                  : ""
              }
              {
                radius != 0 && direct ? <DirectionsRenderer
                  directions={direct}
                  options={{
                    suppressMarkers: true
                  }}
                /> : ""
              }

              {
                showMarker &&
                <Marker
                  position={center}
                  defaultVisible={true}
                  name="name"
                  icon={{
                    url: '/image/user.png',
                    scaledSize: new google.maps.Size(50, 50)
                  }}
                  draggable={true}
                  onDragEnd={this.onUserMove}
                >
                  <InfoWindow><div>
                    <span style={{ color: "green" }}>Đ/c: </span>{infor}
                    <br />
                    <span style={{ color: "green" }}>Tên: </span>{location.name}
                    <br />
                    <span style={{ color: "green" }}>SĐT: </span>{location.phone}
                  </div></InfoWindow>
                </Marker>
              }
            </GoogleMap >
            : <h2>Loading</h2>
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