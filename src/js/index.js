import React from 'react';
import { render } from 'react-dom';
import App from './App';
import './styles';
import config from '../../config';

document.write(
  `<script async defer src='https://maps.googleapis.com/maps/api/js?key=${config.googleMapApiKey}&callback=initMap'></script>`
);

if (process.env.NODE_ENV === 'production') {
  console.log('we are in PRODUCTION!!!!');
}

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
