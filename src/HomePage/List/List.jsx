import React from 'react';
import ListPagination from './ListPagination/ListPagination';
import { css } from 'react-emotion';
import { PulseLoader } from 'react-spinners';
import LinkContainer from './Link/LinkContainer';

const List = props => {
  let spinnerCss = css`
    size: 10px;
    margin: 50px auto;
  `;

  return (
    <div className="LinksList">
      {props.maxPages > 1 && (
        <ListPagination
          currentPage={props.currentPage}
          maxPages={props.maxPages}
          handleNextPage={props.handleNextPage}
          handlePreviousPage={props.handlePreviousPage}
        />
      )}
      {props.loading ? (
        <PulseLoader className={spinnerCss} sizeUnit={'px'} size={10} color={'#343a40'} loading={props.loading} />
      ) : (
        <ul className="pl-1">
          {props.list.map((link, index) => {
            return (
              <LinkContainer
                key={index}
                username={props.username}
                linkKey={index}
                linkId={link.linkId}
                url={link.url}
                title={link.title}
                date={link.date}
                tags={link.tags || []}
                maxTags={props.maxTags}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default List;
