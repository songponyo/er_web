import React, { useEffect, useState } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import { Modal, Button } from "antd";

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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  function showPosition(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    setLat(lat);
    setLot(lng);
  }

  function Mapsvalue() {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude; 
    let position = {}
    position.longitude = lat
    position.latitude = lng
    return position
  }

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
