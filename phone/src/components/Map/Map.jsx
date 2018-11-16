/* eslint-disable no-undef */
import React from 'react'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  SearchBox,
  InfoWindow, Circle, DirectionsRenderer
} from "react-google-maps"
import { compose, withProps,lifecycle } from 'recompose'
const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyCScHlkcWZyzl7P0MfNYutchAEzoSzAUgU&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `520px` }} />,
    mapElement: <div style={{ height: `100%`, width: "930px" }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      const DirectionsService = new google.maps.DirectionsService();

      DirectionsService.route({
        origin: new google.maps.LatLng(10.7626272,  106.6805864),
        destination: new google.maps.LatLng(10.7626372,  106.6850864),
        travelMode: google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      });
    }
  })
)(props =>
  <GoogleMap
    defaultZoom={15}
    defaultCenter={{ lat: 10.7626272, lng: 106.6805864 }}
  >
    <Circle
      defaultCenter={{ lat: 10.7626272, lng: 106.6805864 }}
      defaultRadius={1000}
    />
    {/* <DirectionsRenderer directions={props.directions} /> */}
    <Marker
      position={{ lat: 10.7626272, lng: 106.6805864 }}
      onClick={props.onMarkerClick}
      defaultVisible={true}
      icon={{
        url: 'image/user.png',
        scaledSize: new google.maps.Size(30, 30)
      }}
    >
      <InfoWindow ><div>this is infor</div></InfoWindow>
    </Marker>
    <Marker position={{ lat: 10.7626274, lng: 106.6505846 }} onClick={props.onMarkerClick} defaultVisible={false} />
  </GoogleMap >
  )
export default MyMapComponent