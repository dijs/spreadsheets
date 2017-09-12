import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    const rows = [];
    rows.push(
      <tr>
        <th/>
        {
          Array(4).fill(0).map((v, x) => <th>{String.fromCharCode('A'.charCodeAt(0) + x)}</th>)
        }
      </tr>
    );
    for (let y = 0; y < 4; y++) {
      rows.push(
        <tr>
          <td className="row-label">{y + 1}</td>
          {
            Array(4).fill(0).map((v, x) => <td><input type="text" className="cell" /></td>)
          }
        </tr>
      );
    }
    return (
      <div className="App">
        <table>
          {rows}
        </table>
      </div>
    );
  }
}

export default App;
