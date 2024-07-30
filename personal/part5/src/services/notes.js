import axios from 'axios';
import { response } from '../../../part4/app';
// const baseUrl = 'http://localhost:3001/notes'; if using the json db
// const baseUrl = "http://localhost:3001/api/notes"; if using the backend locally hosted
const baseUrl = '/api/notes';

let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then(response => response.data);
};

export default { getAll, update, create, setToken };