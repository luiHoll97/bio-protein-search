import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { SearchType } from '../types';

interface SearchBarProps {
  onSearch: (query: string, searchType: SearchType) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('all');

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearchTypeChange = (event: SelectChangeEvent) => {
    setSearchType(event.target.value as SearchType);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), searchType);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Search for Proteins
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        <TextField
          fullWidth
          label="Enter protein identifier or GO term"
          variant="outlined"
          value={query}
          onChange={handleQueryChange}
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel id="search-type-label">Search Type</InputLabel>
          <Select
            labelId="search-type-label"
            value={searchType}
            label="Search Type"
            onChange={handleSearchTypeChange}
          >
            <MenuItem value="accession">Protein Accession</MenuItem>
            <MenuItem value="unambiguous">Unambiguous ID</MenuItem>
            <MenuItem value="go_term">GO Term</MenuItem>
            <MenuItem value="all">All Identifiers</MenuItem>
          </Select>
        </FormControl>
        <Button 
          type="submit" 
          variant="contained" 
          startIcon={<SearchIcon />}
          disabled={!query.trim()}
          sx={{ height: 56, width: '50%', alignSelf: 'center', padding: '20px' }} // LUI_FE sort this - not quite right size
        >
          Search
        </Button>
      </Box>
    </Paper>
  );
};

export default SearchBar;