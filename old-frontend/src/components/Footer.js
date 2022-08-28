import { Grid, Typography } from '@mui/material';
import Container from '@mui/system/Container';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
            <Grid item xs={12}>

              <Container justify="center">

                <Link to="/" style={{ padding: '10px' }}>
                  <Typography variant="h7">
                    Download File
                  </Typography>
                </Link>

                <Link to="/upload" style={{ padding: '10px' }}>
                  <Typography variant="h7">
                    Upload File
                  </Typography>
                </Link>

              </Container>

            </Grid>
    );
}