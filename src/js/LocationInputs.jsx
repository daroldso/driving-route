import React from 'react';
import PropTypes from 'prop-types';

LocationInputs.propTypes = {
  origin: PropTypes.string,
  destination: PropTypes.string,
  dropoffs: PropTypes.arrayOf(PropTypes.string),
  handleSubmit: PropTypes.func,
  handleInputsChange: PropTypes.func,
  handleDeleteIconClick: PropTypes.func,
  handleDropoffChange: PropTypes.func,
  handleAddDropoffClick: PropTypes.func
};

export default function LocationInputs(props) {
  return (
    <form id="form" onSubmit={props.handleSubmit}>
      <div className="row">
        <div className="col s12 m6">
          <div className="input-field">
            <input
              id="origin"
              name="origin"
              type="text"
              className="validate"
              value={props.origin}
              onChange={props.handleInputsChange}
              required
            />
            <label htmlFor="origin">Start Location</label>
          </div>
          {props.dropoffs.map((dropoff, i) => (
            <div className="input-field" key={i}>
              <i
                className="material-icons delete"
                onClick={props.handleDeleteIconClick.bind(null, i)}>
                delete_forever
              </i>
              <input
                id={`dropoffs[${i}]`}
                name="dropoffs"
                type="text"
                className="validate"
                required
                value={dropoff}
                onChange={props.handleDropoffChange.bind(null, i)}
              />
              <label htmlFor="dropoffs">Dropoff</label>
            </div>
          ))}
        </div>
        <div className="input-field col s12 m6">
          <input
            id="destination"
            name="destination"
            type="text"
            className="validate"
            value={props.destination}
            onChange={props.handleInputsChange}
            required
          />
          <label htmlFor="destination">End Location</label>
        </div>
        <div className="col s12 m12">
          <div className="row">
            <div className="col s12 m6">
              <button
                className="waves-effect waves-light btn light-blue"
                onClick={props.handleAddDropoffClick}>
                Add dropoff point
              </button>
            </div>
            <div className="col s12 m6">
              <button className="waves-effect waves-light btn" type="submit">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
