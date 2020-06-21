import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import ColorsTimeline from './ColorsTimeline';
import SimpleTable from './SimpleTable';
import Divider from '@material-ui/core/Divider';

class TeamSelector extends React.Component {
  state = {
    team: 'calendar'
  }
  render() {
    return (
      <ButtonGroup className='buttonGroup' color="primary" aria-label="outlined primary button group">
      <Button>전체</Button>
      <Button>A팀</Button>
      <Button>B팀</Button>
      <Button>C팀</Button>
      <Button>D팀</Button>
    </ButtonGroup>
      );
  }
}

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container fixed>
        <h2>Git Log App</h2>
        <Divider />
        <TeamSelector />
        <SimpleTable />
        <ColorsTimeline />
      </Container>
    </React.Fragment>
  );
}

export default App;

