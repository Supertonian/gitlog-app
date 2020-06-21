import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import data from './test.json';

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

  render() {
    return (
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Git commit 메시지</TableCell>
              <TableCell align="right">작성자</TableCell>
              <TableCell align="right">날짜</TableCell>
              <TableCell align="right">Hash</TableCell>
              <TableCell align="right">팀명</TableCell>
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
            <TableCell align="right">{row.authorDateRel}</TableCell>
            <TableCell align="right">{row.abbrevHash}</TableCell>
            <TableCell align="right">{row.abbrevHash}</TableCell>
          </TableRow>
        ))
      }
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}