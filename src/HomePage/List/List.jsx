import React from 'react';
import LinkContainer from './Link/LinkContainer';

const List = (props) =>
	<ul className='pl-1'>
		{
			props.list.map((link, index) => {
				return (
					<LinkContainer
						key={index}
						linkKey={index}
						linkId={link.linkId}
						url={link.url}
						title={link.title}
						date={link.date}
						tags={link.tags || []}
						maxTags={props.maxTags}
					/>
				)
			})
		}
	</ul>

export default List;