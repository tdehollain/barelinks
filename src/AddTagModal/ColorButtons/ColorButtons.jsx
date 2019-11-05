import React from 'react';
// import PropTypes from 'prop-types';

const ColorButtons = props => {
  return (
    <div className="px-2">
      <ul className="list-inline d-flex justify-content-around colorItems">
        {props.tagColors.length &&
          props.tagColors.map((color, index) => {
            return (
              <li
                key={index}
                className={`list-inline-item colorItem rounded-circle${index === props.activeColor ? ' active' : ''}`}
                style={{ background: color }}
                onClick={() => props.selectTagColor(index)}
                tabIndex={index}
                onKeyPress={props.handleKeyPress}
              ></li>
            );
          })}
      </ul>
    </div>
  );
};

// ColorButtons.propTypes = {
// 	tagColors: PropTypes.arrayOf(PropTypes.string).isRequired,
// 	activeColor: PropTypes.number.isRequired,
// 	selectTagColor: PropTypes.func.isRequired
// };

export default ColorButtons;
