// The express HTTP server.
import 'babel-polyfill';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import compression from 'compression';
import helmet from 'helmet';
import api from './api';

// Create and return the HTTP server. Start the server by calling .listen() on
// the return value of this function.
function server() {
  let app = express();
  app.use(compression());
  app.use(helmet());
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }
  if (process.env.NODE_ENV === 'production') {
    app.use(morgan('common'));
  }
  app.use('/v1', api());
  let indexPage = path.join(__dirname, '../../public/index.html');
  app.get('/', (req, res) => res.sendFile(indexPage));
  app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/favicon.ico'));
  });
  app.use('/', express.static('./build'));
  app.use((req, res) => {
    res.status(404)
    res.sendFile(indexPage);
  });
  app.use((error, req, res, next) => {
    console.error(error);
    res.sendStatus(500);
  });
  return app;
}

if (require.main === module) {
  let app = server();
  let port = process.env.NODE_ENV === 'production' ? 80 : 3000;
  app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
}

export default server;
