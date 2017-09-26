import React from 'react';
import { render } from 'react-dom';
import App from './App';
import './styles';
import config from '../../config';

// Fetch Google Map API on start
document.write(
  `<script async defer src='https://maps.googleapis.com/maps/api/js?key=${config.googleMapApiKey}&callback=initMap'></script>`
);

// Callback function after Google Map API is loaded to init React root element
window.initMap = function() {
  const directionsService = new google.maps.DirectionsService();
  const directionsDisplay = new google.maps.DirectionsRenderer();

  render(
    <App
      directionsService={directionsService}
      directionsDisplay={directionsDisplay}
    />,
    document.getElementById('app')
  );
};
