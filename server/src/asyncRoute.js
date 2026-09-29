// Express 4 does not catch rejected promises from async handlers. Every async
// route/middleware is wrapped so a database failure reaches the error
// middleware instead of leaving the request hanging or crashing the process.
export const wrap = (fn) => (req, res, next) => {
  Promise.resolve()
    .then(() => fn(req, res, next))
    .catch(next);
};
