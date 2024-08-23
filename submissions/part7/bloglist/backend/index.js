const PORT = require('./utils/config').PORT;
const app = require('./app');
const logger = require('./utils/logger');

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
