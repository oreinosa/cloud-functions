
import { https } from 'firebase-functions';
import quotesApp from './quotes';
import wordsApp from './words';

export const quotes = https.onRequest(quotesApp);
export const words = https.onRequest(wordsApp);