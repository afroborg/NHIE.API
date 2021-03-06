import { Router } from 'express';
import { getRandom } from '../services/array-services';
import { deleteDoc, getDocs, setDoc } from '../services/firestore-service';

const router = Router();

const COLLECTION = 'questions';

router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit?.toString() ?? '100');

  const questions = await getDocs(COLLECTION, limit);

  res.send({
    total: questions.length,
    questions: questions.map((q: any) => ({ title: q.title, id: q.id })),
  });
});

router.get('/random', async (req, res) => {
  const limit = parseInt(req.query.limit?.toString() ?? '100');

  const questions = await getDocs(COLLECTION, 999);

  const random = getRandom(questions, limit);

  random.forEach((q) => {
    setDoc(COLLECTION, { ...q, timesUsed: q.timesUsed + 1 }, q.id);
  });

  res.send({
    total: random.length,
    questions: random.map((q: any) => ({ title: q.title, id: q.id })),
  });
});

router.get('/details', async (req, res) => {
  const limit = parseInt(req.query.limit?.toString() ?? '100');

  const questions = await getDocs(COLLECTION, limit);

  res.send({
    total: questions.length,
    questions,
  });
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
  body.forEach(async (s: string) => {
    await setDoc(COLLECTION, { title: s, dateAdded: new Date(), timesUsed: 0 });
  });
  return res.send(200);
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
