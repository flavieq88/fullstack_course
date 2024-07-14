import axios from 'axios';
// const baseUrl = 'http://localhost:3001/notes'; if using the json db
// const baseUrl = "http://localhost:3001/api/notes"; if using the backend locally hosted
const baseUrl = '/api/notes';

const getAll = () => {
    const nonExisting = {
        id: 1000,
        content: 'this note is not saved to server',
        important: false
    };
    const request = axios.get(baseUrl);
    return request.then(response => response.data.concat(nonExisting));
};

const create = (newObject) => {
    const request = axios.post(baseUrl, newObject);
    return request.then(response => response.data);
};

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject);
    return request.then(response => response.data);
};

export default { getAll, update, create };
