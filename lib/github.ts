// lib/github.ts

import axios from 'axios';
import { Repository } from '../type';

export const fetchRepositories = async (): Promise<Repository[]> => {
  try {
    const response = await axios.get('https://api.github.com/orgs/freeCodeCamp/repos');
    return response.data;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return [];
  }
};
