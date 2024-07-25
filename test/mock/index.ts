// import type { Request, Response } from 'express';

module.exports = {
  'GET /webapi/aaa': {
    delay: 200,
    response: {
      code: 0,
      data: {
        list: [
          {
            name: "syf",
            age: 18
          }
        ]
      }
    }
  },
  'POST /api/test': {
    delay: 600,
    response: (req, res) => {
      console.log(req?.baseUrl, res?.cookie);
      return {
        ret: 0,
        data: {
          list: [
            {
              name: 'test',
              age: 666,
            },
          ],
        },
      };
    }
  },

  'POST /api/list': {
    delay: 3000,
    response: (req, res) => {
      console.log(req?.baseUrl, res?.cookie);
      return {
        ret: 0,
        data: {
          list: [
            {
              name: 'guile',
              age: 17,
            },
          ],
        },
      };
    }
  },
};
