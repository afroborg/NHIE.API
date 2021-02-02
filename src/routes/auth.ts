import { Router } from 'express';
import config from '../config';
import { getDoc, setDoc } from '../services/firestore-service';

const router = Router();

router.post('/', async (req, res) => {
  const { body } = req;
  if (!body.password) {
    return res.status(401).send();
  }
  const password =
    (await getDoc<{ value: string }>('secrets', 'password')).value ??
    config.PASSWORD;
  return res.status(body.password === password ? 200 : 401).send();
});

router.post('/password', async (req, res) => {
  const { body } = req;

  await setDoc(
    'secrets',
    { value: body.password, lastUpdated: new Date() },
    'password'
  );

  return res.status(201).send();
});

export default router;
