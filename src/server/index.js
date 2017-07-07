import 'babel-polyfill';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import api from './api';

function server() {
  let app = express();
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }
  app.use('/v1', api());
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../../index.html'))
  });
  app.use('/', express.static('./build'));
  return app;
}

if (require.main === module) {
  let app = server();
  let port = process.env.NODE_ENV === 'production' ? 80 : 3000;
  app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
}

export default server;
