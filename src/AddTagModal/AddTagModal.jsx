import React from 'react';
// import PropTypes from 'prop-types';
import CommonTag from './CommonTag/CommonTag';
import ColorButtons from './ColorButtons/ColorButtons';

const AddTagModal = props => {
  const handleKeyPress = e => {
    let key = 'which' in e ? e.which : e.keyCode;
    if (key === 13) document.querySelector('#addTagSubmitButton').click();
  };

  return (
    <div className="modal fade" id="addTagModal" tabIndex="-1" role="dialog" aria-labelledby="addTagModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addTagModalLabel">
              Add tag
            </h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="container">
            <input
              type="text"
              id="addTagInput"
              className="form-control mt-3"
              placeholder="Search existing tags, or enter new tag name"
              autoFocus
              value={props.enteredTagName}
              onChange={props.changeEnteredTagName}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="modal-body mt-2 pt-1 pb-0">
            {props.commonTags
              ? props.commonTags.map((tag, index) => {
                  return <CommonTag key={index} name={tag.name} color={tag.color} tagClick={() => props.tagClick(tag)} />;
                })
              : null}
          </div>
          <div>
            <p className="newTagColorText">New tag color:</p>
          </div>
          <ColorButtons
            tagColors={props.tagColors}
            activeColor={props.activeColor}
            selectTagColor={props.selectTagColor}
            handleKeyPress={handleKeyPress}
          />
          <div className="modal-footer">
            <button type="button" id="addTagCancelButton" className="btn btn-outline-secondary btn-sm" data-dismiss="modal">
              Cancel
            </button>
            <button
              type="button"
              id="addTagSubmitButton"
              className="btn btn-outline-primary btn-sm"
              data-dismiss="modal"
              onClick={() => props.addTag()} // if not doing that the function is called with a Class as first argument
            >
              Create new tag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// AddTagModal.propTypes = {
// 	tagClick: PropTypes.func.isRequired,
// 	commonTags: PropTypes.arrayOf(PropTypes.shape({
// 		name: PropTypes.string.isRequired,
// 		color: PropTypes.string.isRequired
// 	})),
// 	enteredTagName: PropTypes.string.isRequired,
// 	changeEnteredTagName: PropTypes.func.isRequired,
// 	tagColors: PropTypes.arrayOf(PropTypes.string).isRequired,
// 	activeColor: PropTypes.number.isRequired,
// 	selectTagColor: PropTypes.func.isRequired,
// 	addTag: PropTypes.func.isRequired
// }

export default AddTagModal;
