import express from 'express';
import bodyParser from 'body-parser';
import JobStore from './JobStore';

function api() {
  function areInputRowsValid(inputRows) {
    return Array.isArray(inputRows) && inputRows.every(isInputRowValid);
  }

  function isInputRowValid(inputRow) {
    return Object.keys(inputRow).length === 2
      && typeof inputRow.name === 'string'
      && typeof inputRow.address === 'string';
  }

  let jobStore = new JobStore();
  let router = express.Router();
  router.use(bodyParser.json());
  router.post('/jobs', (req, res) => {
    if (!areInputRowsValid(req.body.rows)) {
      res.status(400).json({});
      return;
    }
    let jobID = jobStore.createJob(req.body.rows);
    res.json({id: jobID});
  });
  router.get('/jobs/:id', (req, res) => {
    if (jobStore.doesJobExist(req.params.id)) {
      if (jobStore.isJobFinished(req.params.id)) {
        res.json({rows: jobStore.getJobResult(req.params.id)});
      } else {
        res.status(202).json({});
      }
    } else {
      res.status(404).json({});
    }
  });
  router.use((req, res) => res.sendStatus(404));
  router.use((error, req, res, next) => {
    if (error instanceof SyntaxError) {
      // Probably a body-parser error. There's no other way to check.
      res.status(400).json({});
    } else {
      console.error(error);
      res.sendStatus(500);
    }
  });
  return router;
}

export default api;
