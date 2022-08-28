import { Grid, Container } from "@mui/material";
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';

export default function DownloadForm({ downloadFileMain, fileName, setFileName, loading }) {

    return (
      <Grid item xs={6}>
        <Container
          justify="center"
          spacing={3}
        >
          <form onSubmit={(e) => {
            e.preventDefault();
            downloadFileMain();
          }}>
            <TextField id="file-name" label="File Name" value={fileName} onChange={(e) => { setFileName(e.target.value) }} />
            <br />
            <Container justify="center" spacing={3}>
              <LoadingButton type="submit" loading={loading}
                variant="contained"
                color="primary"
                size="large"
                style={{ marginTop: '10px' }}
              >
                Download File
              </LoadingButton>
            </Container>
          </form>
        </Container>
      </Grid>

    )
}