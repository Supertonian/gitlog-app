import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import data from './test.json';

function ExtractType({ subject }) {
  let type = '';
  if (subject.includes('feat')) {
    type = 'feat';
  } else if (subject.includes('bugfix')) {
    type = 'bugfix';
  }
  return <TableCell align="right">{ type }</TableCell>;
}
export default class SimpleTable extends React.Component {
  constructor() {
    super();
    this.state = {
      rows: [],
    };
  }

  componentDidMount() {
    this.setState({
      rows: data,
    });
  }

  onAllClick() {
    this.setState({
      rows: data,
    });
  }

  onAClick() {
    this.setState({
      rows: [],
    });
  }

  render() {
    return (
      
      <TableContainer component={Paper}>
        <ButtonGroup className='buttonGroup' color="primary" aria-label="outlined primary button group">
          <Button onClick={ () => this.onAllClick() }>전체</Button>
          <Button onClick={ () => this.onAClick() }>A팀</Button>
          <Button>B팀</Button>
          <Button>C팀</Button>
          <Button>D팀</Button>
         </ButtonGroup>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Git commit 메시지</TableCell>
              <TableCell align="right">작성자</TableCell>
              <TableCell align="right">날짜</TableCell>
              <TableCell align="right">Hash</TableCell>
              <TableCell align="right">Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
         {
          this.state.rows.map((row, index) => (
          <TableRow key={index}>
            <TableCell component="th" scope="row">
              {row.subject}
            </TableCell>
            <TableCell align="right">{row.authorName}</TableCell>
            <TableCell align="right">{row.authorDate.split(' +0900')[0]}</TableCell>
            <TableCell align="right">{row.abbrevHash}</TableCell>
            <ExtractType subject={row.subject} />
          </TableRow>
        ))
      }
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}