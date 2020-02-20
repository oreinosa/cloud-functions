import * as express from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { Request, Response } from 'express';
dotenv.config();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const app = express();
const endpoint = process.env.QUOTES_API_ENDPOINT || "";
const apiHost = process.env.QUOTES_API_HOST || "";
const apiKey = process.env.QUOTES_API_KEY || "";

const headers = {
  "x-rapidapi-host": apiHost,
  "x-rapidapi-key": apiKey
};

app.get('/random', async (request: Request, response: Response) => {
  try {
    const { data } = await axios.get(`${endpoint}/random`, {
      headers
    });
    console.log(data);
    response.send(data);
  } catch (e) {
    console.log(e);
    response.status(500).send('Unable to get quote. Please try again.');
  }
});

app.get('/keyword/:keyword', async (request: Request, response: Response) => {
  let { keyword } = request.params;
  if (!keyword) {
    response.status(401).send('Please enter a valid keyword.');
  } else {
    try {
      keyword = keyword.trim().toLowerCase();
      console.log(`searching for ${keyword}`);
      const { data } = await axios.get(`${endpoint}/keyword/${keyword}`, {
        headers
      });
      console.log(data);
      response.send(data);
    } catch (e) {
      console.log(e);
      response.status(500).send('Unable to get quote. Please try again.');
    }
  }
});

app.get('/author/:author', async (request: Request, response: Response) => {
  let { author } = request.params;
  if (!author) {
    response.status(401).send('Please enter a valid author.');
  } else {
    try {
      author = author.trim().toLowerCase();
      console.log(`searching for ${author}`)
      const { data } = await axios.get(`${endpoint}/author/${author}`, {
        headers
      });
      console.log(data);
      response.send(data);
    } catch (e) {
      console.log(e);
      response.status(500).send('Unable to get quote. Please try again.');
    }
  }
});

export default app;