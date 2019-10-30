import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import GoTag from 'react-icons/lib/go/tag';
import GoTrashcan from 'react-icons/lib/go/trashcan';

class Tag extends Component {
  render() {
    return (
      <span className="tag small" style={{ background: this.props.color }}>
        <Link to={'/tags/' + encodeURIComponent(this.props.name) + '/' + this.props.color.slice(-6)}>
          <span className="tagIcon">
            <GoTag />
          </span>
          <span>{this.props.name}</span>
        </Link>
        {this.props.showDeleteButton && (
          <span className="trashcanIcon" onClick={this.props.removeTag.bind(this, this.props.name, this.props.color)}>
            <GoTrashcan />
          </span>
        )}
      </span>
    );
  }
}

// Tag.propTypes = {
// 	name: PropTypes.string.isRequired,
// 	color: PropTypes.string.isRequired,
// 	removeTag: PropTypes.func.isRequired
// }

export default Tag;
