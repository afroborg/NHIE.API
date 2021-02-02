import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import * as functions from 'firebase-functions';
import { withAuth } from './middlewares/auth.middleware';
import { withFormattedResponse } from './middlewares/response.middleware';
import auth from './routes/auth';
import questions from './routes/questions';

const app = express();
const router = express.Router();

app.use(cors());
app.use(json());
app.use('/api', router);

router.use(withFormattedResponse);

router.use('/auth', auth);

router.use(withAuth);

router.use('/questions', questions);

export const api = functions.https.onRequest(app);
