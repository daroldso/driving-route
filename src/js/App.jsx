import React from 'react';
import PropTypes from 'prop-types';
import DirectionMap from './DirectionMap';

App.propTypes = {
  directionsService: PropTypes.object,
  directionsDisplay: PropTypes.object
};

export default function App(props) {
  return (
    <div className="container">
      <h1>Driving Route</h1>
      <DirectionMap
        directionsService={props.directionsService}
        directionsDisplay={props.directionsDisplay}
      />
    </div>
  );
}
