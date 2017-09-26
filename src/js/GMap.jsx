import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class GMap extends Component {
  static propTypes = {
    directionsDisplay: PropTypes.object
  };

  componentDidMount() {
    var map = new google.maps.Map(this.mapDiv, {
      zoom: 11,
      center: { lat: 22.353017, lng: 114.111641 }
    });
    this.props.directionsDisplay.setMap(map);
  }

  render() {
    return (
      <div id="map" className="map" ref={mapDiv => (this.mapDiv = mapDiv)} />
    );
  }
}
