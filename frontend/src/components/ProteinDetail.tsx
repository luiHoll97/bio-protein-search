import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ProteinDetail } from '../types';

interface ProteinDetailComponentProps {
  detail: ProteinDetail;
}

const ProteinDetailComponent: React.FC<ProteinDetailComponentProps> = ({ detail }) => {
  const { protein, identifiers, functional_annotations, protein_interactions } = detail;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const typeMap: Record<string, string> = {
    'Protein': 'Protein',
    'MolecularFunction': 'Molecular Function',
    'BiologicalProcess': 'Biological Process',
    'CellularComponent': 'Cellular Component',
  };

  const paginatedInteractions = protein_interactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {protein.name || 'Protein Details'}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          ID: {protein.external_id || protein.id}
        </Typography>

        {protein.organism_name && (
          <Typography variant="body1" sx={{ mb: 2 }}>
            Organism: <strong>{protein.organism_name}</strong>
          </Typography>
        )}

        <Box sx={{ mt: 2, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">Node Type</TableCell>
                    <TableCell>{typeMap[protein.node_type || ''] || protein.node_type}</TableCell>
                  </TableRow>
                  {protein.dataset && (
                    <TableRow>
                      <TableCell component="th" scope="row">Dataset</TableCell>
                      <TableCell>{protein.dataset}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell component="th" scope="row">UUID</TableCell>
                    <TableCell>{protein.id}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Identifiers
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>System</TableCell>
                    <TableCell>Identifier</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {identifiers.length > 0 ? (
                    identifiers.map((identifier, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{identifier.external_id_system || 'Unknown'}</TableCell>
                        <TableCell>{identifier.external_id}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2}>No identifiers available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>

        {protein.protein_sequence && (
          <Accordion sx={{ mt: 3 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Protein Sequence</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Paper variant="outlined" sx={{ p: 2, maxHeight: 200, overflow: 'auto' }}>
                <Typography variant="body2" fontFamily="monospace" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {protein.protein_sequence}
                </Typography>
              </Paper>
            </AccordionDetails>
          </Accordion>
        )}
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Functional Annotations
        </Typography>
        {functional_annotations.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>GO Term</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {functional_annotations.map((annotation, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {annotation.go_term.name || annotation.go_term.external_id}
                      </Typography>
                      {annotation.go_term.external_id && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          {annotation.go_term.external_id}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{annotation.go_term.description || 'No description'}</TableCell>
                    <TableCell>{typeMap[annotation.go_term.node_type || ''] || annotation.go_term.node_type}</TableCell>
                    <TableCell>
                      {annotation.score != null 
                        ? annotation.score.toFixed(3)
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1">No functional annotations available protein</Typography>
        )}
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Protein-Protein Interactions
        </Typography>
        {protein_interactions.length > 0 ? (
          <Box>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Protein Name</TableCell>
                    <TableCell>Organism</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>Interaction Score</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedInteractions.map((interaction, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {interaction.protein.name || interaction.protein.external_id || 'Unnamed Protein'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {interaction.protein.organism_name || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {interaction.protein.external_id || interaction.protein.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={interaction.score != null ? interaction.score.toFixed(3) : 'N/A'} 
                          color={interaction.score != null && interaction.score > 0.7 ? "primary" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button 
                          component={Link} 
                          href={`/protein/${interaction.protein.id}`}
                          variant="outlined" 
                          size="small"
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={protein_interactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        ) : (
          <Typography variant="body1">No protein-protein interactions available for protein</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ProteinDetailComponent;