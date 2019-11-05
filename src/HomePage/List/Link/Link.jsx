import React from 'react';
import TagContainer from './Tag/TagContainer';
// import PropTypes from 'prop-types';
import { formatDate, showYear } from '../../../utils/util.js';

const Link = props => {
  return (
    <li>
      <button type="button" className="delBtn btn btn-danger" onClick={() => props.removeLink(props.linkId)}>
        &times;
      </button>
      <span className="small font-italic mx-1 mt-0">{formatDate(new Date(props.date), showYear(new Date(props.date)))}</span>
      <a className="link" href={props.url}>
        {props.title.trim()}
      </a>
      {props.tags.map((tag, index) => {
        return (
          <TagContainer
            username={props.username}
            key={index}
            linkId={props.linkId}
            name={tag.name}
            color={tag.color}
            showDeleteButton={true}
          />
        );
      })}
      {props.tags.length < props.maxTags && (
        <div className="d-inline">
          <button
            type="button"
            className="btn btn-outline-success tag addTagButton"
            data-toggle="modal"
            data-target="#addTagModal"
            onClick={props.showAddTagModal.bind(this, props.linkKey, props.linkId)}
          >
            +
          </button>
        </div>
      )}
    </li>
  );
};

export default Link;

// Link.propTypes = {
// 	linkKey: PropTypes.number.isRequired,
// 	linkId: PropTypes.string, // not required because it exists only after added to the DB
// 	url: PropTypes.string.isRequired,
// 	title: PropTypes.string.isRequired,
// 	date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
// 	tags: PropTypes.arrayOf(PropTypes.shape({
// 		name: PropTypes.string.isRequired,
// 		color: PropTypes.string.isRequired
// 	})),
// 	removeLink: PropTypes.func,
// 	maxTags: PropTypes.number.isRequired,
// 	showAddTagModal: PropTypes.func.isRequired
// }
