import React, { useState } from 'react';
import { Alert, Box, CircularProgress, Container, Typography } from '@mui/material';
import SearchBar from '../components/SearchBar';
import ProteinList from '../components/ProteinList';
import { ProteinSearchResult, SearchType } from '../types';
import { searchProteins } from '../services/api';

const HomePage: React.FC = () => {
  const [results, setResults] = useState<ProteinSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (query: string, searchType: SearchType) => {
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await searchProteins(query, searchType);
      setResults(response.results);
    } catch (err) {
      console.error('Error during search:', err);
      setError('Failed to search proteins');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Bio Protein Info
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary">
          Search for proteins by their identifiers or GO terms
        </Typography>

        <SearchBar onSearch={handleSearch} />

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && searched && results.length === 0 && !error && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No proteins found matching your search criteria. Try a different identifier or search type.
          </Alert>
        )}

        {!loading && results.length > 0 && <ProteinList results={results} />}

        {!searched && (
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Enter a protein identifier or GO term in the search bar above to get started.
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;