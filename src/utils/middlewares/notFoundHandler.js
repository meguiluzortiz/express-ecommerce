const boom = require('@hapi/boom');
const isRequestAjaxOrApi = require('../isRequestAjaxOrApi');

function notFoundHandler(req, res) {
  if (isRequestAjaxOrApi(req)) {
    const {
      output: { statusCode, payload },
    } = boom.notFound();

    return res.status(statusCode).json(payload);
  }

  return res.status(404).render('404');
}

module.exports = notFoundHandler;
