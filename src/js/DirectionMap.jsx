import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import delay from 'delay';
import LocationInputs from './LocationInputs';
import GMap from './GMap';
import Preloader from './Preloader';
import config from '../../config';

export default class DirectionMap extends Component {
  static propTypes = {
    directionService: PropTypes.object,
    directionsDisplay: PropTypes.object
  };

  state = {
    origin: '',
    destination: '',
    dropoffs: [],
    isLoading: false
  };

  handleInputsChange = event => {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  };

  handleDropoffChange = (i, event) => {
    const target = event.target;
    const name = target.name;
    const value = this.state.dropoffs.map((dropoff, index) => {
      return i === index ? target.value : dropoff;
    });

    this.setState({
      dropoffs: value
    });
  };

  handleDeleteIconClick = (i, event) => {
    this.setState({
      dropoffs: this.state.dropoffs.filter((dropoff, index) => i !== index)
    });
  };

  handleAddDropoffClick = event => {
    event.preventDefault();

    this.setState({
      dropoffs: [...this.state.dropoffs, '']
    });
  };

  handleSubmit = async event => {
    event.preventDefault();

    const allLocations = this.getAllLocations();

    const routes = await Promise.all(
      allLocations.map(async location => {
        return await this.getLocationCoords(location);
      })
    );

    this.processRoutes(routes);
  };

  getAllLocations = () => {
    return [this.state.origin, ...this.state.dropoffs, this.state.destination];
  };

  getLocationCoords = location => {
    return axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${config.googleMapApiKey}`
      )
      .then(res => res.data.results[0].geometry.location)
      .then(({ lat, lng }) => [lat + '', lng + '']);
  };

  processRoutes = async routesFromUser => {
    var token, routes;

    this.setState({
      isLoading: true
    });

    while (!token) {
      try {
        token = await this.postToApi(routesFromUser);
      } catch (err) {
        Materialize.toast(
          'Fail to POST route. Retrying in 2 seconds',
          2000,
          'red darken-2'
        );
        await delay(2000);
      }
    }

    while (!routes) {
      try {
        routes = await this.getRouteFromApi(token);
      } catch (err) {
        Materialize.toast(
          'Fail to GET route. Retrying in 2 seconds',
          2000,
          'red darken-2'
        );
        await delay(2000);
      }
    }

    this.calculateAndDisplayRoute(routes);
  };

  postToApi = routes => {
    return axios
      .post('http://localhost:8080/route', routes)
      .then(res => res.data.token);
  };

  getRouteFromApi = token => {
    return axios
      .get(`http://localhost:8080/route/${token}`)
      .then(res => res.data.path);
  };

  convertRoutesToLatLngLiteral = routes => {
    return routes.map(route => {
      return {
        location: { lat: parseFloat(route[0]), lng: parseFloat(route[1]) },
        stopover: true
      };
    });
  };

  calculateAndDisplayRoute = routes => {
    const waypoints = this.convertRoutesToLatLngLiteral(routes);
    this.props.directionsService.route(
      {
        origin: this.state.origin,
        destination: this.state.destination,
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: 'DRIVING'
      },
      (response, status) => {
        if (status === 'OK') {
          this.props.directionsDisplay.setDirections(response);
        } else {
          let msg = `Directions request failed due to ${status}`;
          Materialize.toast(msg, 5000, 'red darken-2');
        }
        this.setState({
          isLoading: false
        });
      }
    );
  };

  render() {
    return (
      <div>
        <Preloader isLoading={this.state.isLoading} />
        <LocationInputs
          handleInputsChange={this.handleInputsChange}
          handleDropoffChange={this.handleDropoffChange}
          handleDeleteIconClick={this.handleDeleteIconClick}
          handleAddDropoffClick={this.handleAddDropoffClick}
          handleSubmit={this.handleSubmit}
          {...this.state}
        />
        <GMap directionsDisplay={this.props.directionsDisplay} />
      </div>
    );
  }
}
