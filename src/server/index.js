import 'babel-polyfill';
import express from 'express';
import morgan from 'morgan';
import api from './api';

function server() {
  let app = express();
  app.use(morgan('dev'));
  app.use('/v1', api());
  return app;
}

if (require.main === module) {
  let app = server();
  let port = process.env.NODE_ENV === 'production' ? 80 : 3000;
  app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
}

export default server;
