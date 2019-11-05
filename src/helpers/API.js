import awsConfig from '../utils/awsConfig';

const getLinks = async (user, token, type, params) => {
  let URL = '';
  let userPart = 'user=' + user;
  let pagePart = '&linksPerPage=' + params.linksPerPage + '&page=' + params.page;
  switch (type) {
    case 'homepage':
      URL = awsConfig.APIbaseURL + '/link?' + userPart + pagePart;
      break;
    case 'tagspage':
      URL = awsConfig.APIbaseURL + '/linksbytag?' + userPart + pagePart + '&tagName=' + params.tagName + '&tagColor=' + params.tagColor;
      break;
    case 'searchpage':
      URL = awsConfig.APIbaseURL + '/linksbysearchterm?' + userPart + pagePart + '&searchterm=' + params.searchTerm;
      break;
    default:
      break;
  }

  let raw_response = await fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }
  });
  let list = await raw_response.json();
  // Decode potential HTML entities in title (already done in Lambda function but doesn't work on all entities)
  list.list = list.list.map(el => {
    return {
      ...el,
      title: decodeHtml(el.title)
    };
  });
  // console.log(list);
  return list;
};

const decodeHtml = function(html) {
  var txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const putLink = async (user, token, linkURL) => {
  let URL = awsConfig.APIbaseURL + '/link';

  let options = {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    },
    body: JSON.stringify({ user, url: linkURL })
  };
  let raw_response = await fetch(URL, options);
  let result = await raw_response.json();

  return result;
};

const deleteLink = async (user, token, id) => {
  let URL = awsConfig.APIbaseURL + '/link';
  let options = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    },
    body: JSON.stringify({ user, linkId: id })
  };
  let raw_response = await fetch(URL, options);
  let result = await raw_response.json();
  return result;
};

const getTags = async (user, token) => {
  let URL = awsConfig.APIbaseURL + '/tags?user=' + user;
  let options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }
  };
  let raw_response = await fetch(URL, options);
  let res = await raw_response.json();
  // console.log(res);
  return res.tags;
};

const addRemoveTag = async (username, token, tagDetails, action) => {
  let URL = awsConfig.APIbaseURL + '/link/tag';
  let options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    },
    body: JSON.stringify({
      user: username,
      action: action,
      ...tagDetails
    })
  };
  let raw_response = await fetch(URL, options);
  let res = await raw_response.json();
  // console.log(list);
  return res.tags;
};

export default {
  getLinks,
  putLink,
  deleteLink,
  getTags,
  addRemoveTag
};
