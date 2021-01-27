import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import * as functions from 'firebase-functions';
import config from './config';
import auth from './routes/auth';
import questions from './routes/questions';

const app = express();
const router = express.Router();

app.use(cors());
app.use(json());
app.use('/api', router);

router.use('/auth', auth);

router.use((req, res, next) => {
  if (req.headers.authorization !== config.API_KEY)
    return res.status(401).send();
  next();
});

router.use('/questions', questions);

export const api = functions.https.onRequest(app);
