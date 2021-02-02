import { firestore } from 'firebase-admin';
import { IQuestion, IQuestionForPlay } from '../models/IQuestion';
import { getRandom } from './array-services';
import { getDocs, setMultiple, updateMultiple } from './firestore-service';

const COLLECTION = 'questions';

export const getQuestions = (
  limit = 100,
  detailed = true
): Promise<(IQuestion | IQuestionForPlay)[]> =>
  new Promise((resolve, reject) => {
    getDocs<IQuestion>(COLLECTION, limit)
      .then((questions) => {
        resolve(detailed ? questions : questions.map(toQuestionForPlay));
      })
      .catch(reject);
  });

export const getQuestionsForPlay = (limit = 100): Promise<IQuestionForPlay[]> =>
  new Promise((resolve, reject) => {
    getDocs<IQuestion>(COLLECTION)
      .then((docs) => {
        const random = getRandom(docs, limit);

        updateMultiple(
          COLLECTION,
          random.map((d) => d.id ?? ''),
          { timesUsed: firestore.FieldValue.increment(1) }
        );

        resolve(random.map(toQuestionForPlay));
      })
      .catch(reject);
  });

export const updateMultipleQuestions = (questions: any[]) =>
  new Promise((resolve, reject) => {
    setMultiple(COLLECTION, questions).then(resolve).catch(reject);
  });

const toQuestionForPlay = (q: IQuestion): IQuestionForPlay => ({
  id: q.id ?? '',
  title: q.title,
});
