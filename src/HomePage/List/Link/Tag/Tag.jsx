import React from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import GoTag from 'react-icons/lib/go/tag';
import GoTrashcan from 'react-icons/lib/go/trashcan';

const Tag = props => {
  return (
    <span className="tag small" style={{ background: props.color }}>
      <Link to={'/tags/' + encodeURIComponent(props.name) + '/' + props.color.slice(-6)}>
        <span className="tagIcon">
          <GoTag />
        </span>
        <span>{props.name}</span>
      </Link>
      {props.showDeleteButton && (
        <span className="trashcanIcon" onClick={props.removeTag.bind(this, props.name, props.color)}>
          <GoTrashcan />
        </span>
      )}
    </span>
  );
};

// Tag.propTypes = {
// 	name: PropTypes.string.isRequired,
// 	color: PropTypes.string.isRequired,
// 	removeTag: PropTypes.func.isRequired
// }

export default Tag;
