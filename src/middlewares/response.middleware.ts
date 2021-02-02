import { json } from 'express-mung';

export const withFormattedResponse = json((body: any, req, res) => {
  const isSuccess = res.statusCode >= 200 && res.statusCode < 400;
  const b: any = {
    success: isSuccess,
    data: body,
  };

  if (body instanceof Array) {
    b.length = body.length;
  }

  return b;
});
