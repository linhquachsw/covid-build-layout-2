// @flow
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import _ from 'lodash';

const loadfile = (lng, ns) => {
  try {
    const filename = `${process.cwd()}/public/locales/${lng}/${ns}.json`;

    const rawdata = fs.readFileSync(filename);

    global.locales[lng][ns] = JSON.parse(rawdata);
  } catch (error) {
    global.locales[lng][ns] = {};
  }
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { lng, ns },
  } = req;

  const filename = `${process.cwd()}/public/locales/${lng}/${ns}.json`;

  if (!global.locales) global.locales = {};
  if (!global.locales[lng]) global.locales[lng] = {};

  switch (req.method) {
    case 'POST':
      res.statusCode = 200;

      if (!global.locales[lng][ns]) global.locales[lng][ns] = {};

      Object.entries(req.body).forEach(([key, value]) => {
        global.locales[lng][ns][key] = value;
      });

      res.send('OK');

      break;

    case 'PUT': {
      const entries = Object.entries(global.locales[lng][ns]).sort();

      global.locales[lng][ns] = _.fromPairs(entries);

      if (entries.length > 0)
        fs.writeFile(filename, `${JSON.stringify(global.locales[lng][ns], null, 4)}\n`, (err) => {
          if (err) console.log(err);
        });

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.send('OK');
      break;
    }

    case 'GET': {
      if (!global.locales[lng][ns]) {
        loadfile(lng, ns);
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(global.locales[lng][ns]));
      break;
    }

    case 'DELETE':
      loadfile(lng, ns);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(global.locales[lng][ns]));
      break;

    default:
      res.statusCode = 404;
      res.send('');
      break;
  }
};
