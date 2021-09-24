import React, { useEffect, useState } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

const Maps = (props) => {
  const mapStyles = {
    position: "relative",
    width: "100%",
    height: "350px",
  };
  const [Lat, setLat] = useState(0);
  const [Lot, setLot] = useState(0);

  useEffect(() => {
    getLocation();
  }, []);

  function getLocation() {
    let location = {};
    location = props.value[0];
    location.lot = location.latitude;
    location.lat = location.longitude;
    showPosition(location);
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(showPosition);
    //   console.log("navigator", navigator);
    // } else {
    //   alert("Geolocation is not supported by this browser.");
    // }
  }
  function showPosition(position) {
    // var lat = position.coords.latitude;
    // var lng = position.coords.longitude;
    var lat = position.latitude;
    var lng = position.longitude;
    setLat(lat);
    setLot(lng);
  }
console.log("Lat",Lat)
console.log("Lot",Lot);
  return (
    <div>
      <Map
        google={props.google}
        zoom={15}
        style={mapStyles}
        center={{ lat: Lat, lng: Lot }}
      >
        <Marker position={{ lat: Lat, lng: Lot }} />
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyDyTUdDcKCq67cuR-nOkX0GdkJzdO3EIGc",
})(Maps);
