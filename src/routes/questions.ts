import { Router } from 'express';
import { deleteDoc, setDoc } from '../services/firestore-service';
import {
  getQuestions,
  getQuestionsForPlay,
  updateMultipleQuestions,
} from '../services/question-services';

const router = Router();

const COLLECTION = 'questions';

router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit?.toString() ?? '100');

  const questions = await getQuestions(limit, false);

  res.send(questions);
});

router.get('/random', async (req, res) => {
  const limit = parseInt(req.query.limit?.toString() ?? '100');

  const questions = await getQuestionsForPlay(limit);

  res.send(questions);
});

router.get('/details', async (req, res) => {
  const limit = parseInt(req.query.limit?.toString() ?? '100');

  const questions = await getQuestions(limit);

  res.send(questions);
});

router.post('/', async (req, res) => {
  const { body } = req;
  if (!body.title) {
    return res.status(400).send();
  }

  await setDoc(COLLECTION, {
    title: body.title,
    dateAdded: new Date(),
    timesUsed: 0,
  });

  res.send();
});

router.post('/multiple', async (req, res) => {
  const { body } = req;
  if (body instanceof Array) {
    await updateMultipleQuestions(
      body.map((s) => ({ title: s, dateAdded: new Date(), timesUsed: 0 }))
    );
    return res.send(200);
  }
  return res.status(400).send(null);
});

router.put('/:id', async (req, res) => {
  await setDoc(COLLECTION, req.body, req.params.id);
  return res.status(201).send();
});

router.delete('/:id', async (req, res) => {
  await deleteDoc(COLLECTION, req.params.id);
  return res.status(201).send();
});

export default router;
