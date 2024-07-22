const { MONGODB_URI, PORT } = require('./utils/config');
const app = require('./app');
const { info, error } = require('./utils/logger');

app.listen(PORT, () => {
  info(`Server running on port ${PORT}`);
});
