import React from 'react';
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import ColorsTimeline from './ColorsTimeline';
import SimpleTable from './SimpleTable';
import Divider from '@material-ui/core/Divider';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container fixed>
        <h2>Git Log App</h2>
        <Divider />
        <SimpleTable />
        <ColorsTimeline />
      </Container>
    </React.Fragment>
  );
}

export default App;

