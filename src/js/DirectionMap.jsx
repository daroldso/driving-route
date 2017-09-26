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

  // Handler for origin and destination input change event
  handleInputsChange = event => {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  };

  // Handler for dropoff point input change event
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

  // Handler for delete icon click event
  handleDeleteIconClick = (i, event) => {
    this.setState({
      dropoffs: this.state.dropoffs.filter((dropoff, index) => i !== index)
    });
  };

  // Handler for Add Dropoff Point button click event
  handleAddDropoffClick = event => {
    event.preventDefault();

    this.setState({
      dropoffs: [...this.state.dropoffs, '']
    });
  };

  // Handler for form submit event
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

  /**
   * Get an array of all the locations from state
   * @return {array}
   */
  getAllLocations = () => {
    return [this.state.origin, ...this.state.dropoffs, this.state.destination];
  };

  /**
   * Submit a location to Google Map API and get back the coordinates of the
   * location
   * @param  {string} location
   * @return {Promise}
   */
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

  /**
   * Post route to mockApi
   * @param  {array} routes Array containing arraies of latitude and
   *                        longitude value
   * @return {Promise}
   */
  postToApi = routes => {
    return axios
      .post('http://localhost:8080/route', routes)
      .then(res => res.data.token);
  };

  /**
   * Get routes from mockApi
   * @param  {string} token Returned from POST /route
   * @return {Promise}
   */
  getRouteFromApi = token => {
    return axios
      .get(`http://localhost:8080/route/${token}`)
      .then(res => res.data.path);
  };

  /**
   * Convert routes to LatLngLiteral for Google Map Direction Service
   * @param  {array} routes Returned from GET /route
   * @return {array}        Array of LatLngLiteral
   */
  convertRoutesToLatLngLiteral = routes => {
    return routes.map(route => {
      return {
        location: { lat: parseFloat(route[0]), lng: parseFloat(route[1]) },
        stopover: true
      };
    });
  };

  /**
   * Get the best route from Google Direction Service and update map
   * @param  {array} routes Array of LatLngLiteral
   */
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
