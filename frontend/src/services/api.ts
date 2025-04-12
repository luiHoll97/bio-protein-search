import axios from 'axios';
import { ProteinDetail, SearchResponse, SearchType } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const searchProteins = async (
  query: string,
  searchType: SearchType = 'all'
): Promise<SearchResponse> => {
  try {
    const response = await api.get<SearchResponse>('/search', {
      params: {
        query,
        search_type: searchType,
      },
    });
    console.log('Search response:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error searching proteins:', error);
    throw error;
  }
};

export const getProteinDetail = async (proteinId: string): Promise<ProteinDetail> => {
  try {
    const response = await api.get<ProteinDetail>(`/protein/${proteinId}`);
    console.log('Protein detail response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching protein ${proteinId}:`, error);
    throw error;
  }
};