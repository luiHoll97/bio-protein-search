import React from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { ProteinSearchResult } from '../types';

interface ProteinListProps {
  results: ProteinSearchResult[];
}

const ProteinList: React.FC<ProteinListProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <Box sx={{ mt: 4, p: 2, textAlign: 'center' }}>
        <Typography variant="h6">No proteins found matching your search criteria.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {results.length} Protein{results.length !== 1 ? 's' : ''} Found
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {results.map((result) => (
          <Card key={result.protein.id}>
            <CardActionArea component={Link} to={`/protein/${result.protein.id}`}>
              <CardContent>
                <Typography variant="h6">
                  {result.protein.name || result.protein.external_id || 'Unnamed Protein'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  ID: {result.protein.external_id || result.protein.id}
                  {result.protein.organism_name && ` • Organism: ${result.protein.organism_name}`}
                </Typography>
                
                {result.identifiers.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      Identifiers:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {result.identifiers.map((identifier, idx) => (
                        <Chip
                          key={idx}
                          label={`${identifier.external_id_system || 'ID'}: ${identifier.external_id}`}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                
                {result.protein.dataset && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Dataset: {result.protein.dataset}
                  </Typography>
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ProteinList;

