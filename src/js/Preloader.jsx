import React from 'react';
import PropTypes from 'prop-types';

Preloader.propTypes = {
  isLoading: PropTypes.bool
};

export default function Preloader(props) {
  const activeClass = props.isLoading ? 'active' : '';

  return (
    <div className={`preloader ${activeClass}`}>
      <div className={`preloader-wrapper big active`}>
        <div className="spinner-layer spinner-green-only">
          <div className="circle-clipper left">
            <div className="circle" />
          </div>
          <div className="gap-patch">
            <div className="circle" />
          </div>
          <div className="circle-clipper right">
            <div className="circle" />
          </div>
        </div>
      </div>
    </div>
  );
}
