import { Router } from 'express';
import config from '../config';

const router = Router();

router.post('/', (req, res) => {
  const { body } = req;
  if (!body.password) {
    return res.status(401).send();
  }
  return res.status(body.password === config.PASSWORD ? 200 : 401).send();
});

export default router;
