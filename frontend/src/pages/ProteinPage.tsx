import React, { useEffect, useState } from 'react';
import { Alert, Box, Breadcrumbs, Button, CircularProgress, Container, Link, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProteinDetailComponent from '../components/ProteinDetail';
import { ProteinDetail } from '../types';
import { getProteinDetail } from '../services/api';

const ProteinPage: React.FC = () => {
  const { proteinId } = useParams<{ proteinId: string }>();
  const [proteinDetail, setProteinDetail] = useState<ProteinDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProteinDetail = async () => {
      if (!proteinId) {
        setError('No protein ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const detail = await getProteinDetail(proteinId);
        setProteinDetail(detail);
        setError(null);
      } catch (err) {
        console.error('Error fetching protein detail:', err);
        setError('Failed to load protein details. The protein may not exist or there was a server error.');
      } finally {
        setLoading(false);
      }
    };

    fetchProteinDetail();
  }, [proteinId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/" underline="hover" color="inherit">
            Home
          </Link>
          <Typography color="text.primary">
            {loading ? 'Loading...' : (proteinDetail?.protein.name || proteinDetail?.protein.external_id || 'Protein Detail')}
          </Typography>
        </Breadcrumbs>

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{ mb: 3 }}
        >
          Back to Search
        </Button>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && proteinDetail && (
          <ProteinDetailComponent detail={proteinDetail} />
        )}
      </Box>
    </Container>
  );
};

export default ProteinPage;