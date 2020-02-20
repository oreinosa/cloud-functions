import * as express from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { Request, Response } from 'express';

interface WordResult {
  definition: string;
  partOfSpeech: string;
  synonyms: string[];
  antonyms: string[];
  examples: string[];
};
dotenv.config();

const app = express();
const endpoint = process.env.WORDS_API_ENDPOINT || "";
const apiHost = process.env.WORDS_API_HOST || "";
const apiKey = process.env.WORDS_API_KEY || "";

const headers = {
  "x-rapidapi-host": apiHost,
  "x-rapidapi-key": apiKey
};

app.get('/random', async (request: Request, response: Response) => {
  try {
    const { data } = await axios.get(`${endpoint}/`, {
      headers,
      params: { random: true }
    });
    console.log(data);
    response.send(data);
  } catch (e) {
    console.log(e);
    response.status(500).send('Unable to get word. Please try again.');
  }
});

app.get('/search/:searchingWord', async (request: Request, response: Response) => {
  let { searchingWord } = request.params;
  console.log(`searching for ${searchingWord}`)
  if (!searchingWord || searchingWord.split(' ').length > 1) {
    response.status(401).send('Please enter a valid word.');
  } else {
    try {
      searchingWord = searchingWord.trim().toLowerCase();
      let { data: { results, pronunciation } } = await axios.get(`${endpoint}/${searchingWord}`, {
        headers
      });
      if (!results) {
        response.status(404).send('Word not found.');
      } else {
        let synonyms: string[] = [], antonyms: string[] = [], examples: string[] = [], wordResults: any[] = [];
        results.forEach((result: WordResult) => {
          wordResults.push({
            definition: result.definition,
            partOfSpeech: result.partOfSpeech
          });
          if (result.synonyms) synonyms.push(...result.synonyms);
          if (result.antonyms) antonyms.push(...result.antonyms);
          if (result.examples) examples.push(...result.examples);
        });

        response.status(200).send({ wordResults, pronunciation, synonyms, antonyms, examples });
      }
    } catch (e) {
      console.log(e);
      response.status(500).send('Unable to get word. Please try again.');
    }
  }
});

export default app;