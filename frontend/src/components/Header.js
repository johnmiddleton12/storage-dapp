import { Grid, Typography } from '@mui/material';

export default function Header() {
    return (
      <Grid item
        style={{
          marginTop: '20px',
          marginBottom: '20px'
        }}
      >
        <Typography variant="h4">
          File Downloader
        </Typography>
      </Grid>
    );
}