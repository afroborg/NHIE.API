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
  if (body.password === password) {
    return res.status(200).send();
  } else {
    return res.status(401).send('Lösenordet är felaktigt.');
  }
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
