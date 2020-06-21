import React from 'react';
import './App.css';

function Buttons({team}) {
  return <button onClick={()=>console.log(team)}>{ team }</button>;
}

class TeamSelector extends React.Component {
  state = {
    team: 'calendar'
  }
  buttonClick() {
    this.setState({team: 'gg'});
  }
  render() {
    return <div>
      <h1>hello {this.state.team}</h1>
      <Buttons team='calendar' />
      <Buttons team='talk' />
      <Buttons team='drive' />
      </div>;
  }
}




function App() {
  return (
    <div className="App">
      <header className="App-header">
        <TeamSelector />
      </header>
    </div>
  );
}

export default App;
