import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import ColorsTimeline from './ColorsTimeline';

function Buttons({team}) {
  return <Button color='primary'>{ team }</Button>;
}

class TeamSelector extends React.Component {
  state = {
    team: 'calendar'
  }
  render() {
    return (
    <div>
      <Buttons team='calendar' />
      <Buttons team='talk' />
      <Buttons team='drive' />
      </div>
      );
  }
}

const logs = [
  {
    title: 'Issue #123 [git] hi',
    author: 'Changyun Lee',
    date: '2020-06-22',
    hash: 'ffffff'
  },
  {
    title: 'bug #555 [git] hi',
    author: 'Changyun Lee',
    date: '2020-06-21',
    hash: 'sdfads'
  },
  {
    title: 'Issue #111 [git] hi',
    author: 'Changyun Lee',
    date: '2020-06-20',
    hash: 'sadfsdf'
  },
  {
    title: 'Issue #110 [git] hi',
    author: 'Changyun Lee',
    date: '2020-06-18',
    hash: 'asdfds'
  },
];

class GitLog extends React.Component {
  state = {}

  render() {
    return (
    <table>
      <thead>
        <tr>
          <th>메시지</th>
          <th>작성자</th>
          <th>날짜</th>
          <th>Hash</th>
        </tr>
      </thead>
      <tbody>
        {
          logs.map((log, index) => {
            return (<tr key={index}>
              <td>{log.title}</td>
              <td>{log.author}</td>
              <td>{log.date}</td>
              <td>{log.hash}</td>
              </tr>);
          })
        }
      </tbody>
    </table>
    );
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <TeamSelector />
        <GitLog />
        <ColorsTimeline />
      </header>
    </div>
  );
}

export default App;
