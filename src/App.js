import React, { Component } from 'react';
import Table from './Table';
import './App.css';

function getSavedState() {
  return JSON.parse(localStorage.getItem('state') || '{}');
}

const defaultState = {
  data: {},
  active: undefined,
  width: 5,
  height: 10,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, defaultState, getSavedState());
  }
  savedState() {
    const jsonState = JSON.stringify({
      data: this.state.data,
      width: this.state.width,
      height: this.state.height,
    });
    localStorage.setItem('state', jsonState);    
  }
  handleChange(id, value) {
    this.setState({
      data: Object.assign({}, this.state.data, { [id]: value }),
    }, this.savedState.bind(this));
  }
  handleMove(dx, dy) {
    const curr = this.state.active || { x: 0, y: 0 };
    this.setState({
      active: {
        x: Math.min(Math.max(curr.x + dx, 0), this.state.width - 1),
        y: Math.min(Math.max(curr.y + dy, 1), this.state.height),
      },
    });
  }
  render() {
    return <Table
      width={this.state.width}
      height={this.state.height}
      active={this.state.active}
      handleChange={this.handleChange.bind(this)}
      handleFocus={coords => this.setState({ active: coords })}
      handleBlur={() => this.setState({ active: undefined })}
      handleClear={() => this.setState(Object.assign({}, defaultState), this.savedState.bind(this))}
      addColumn={() => this.setState({ width: this.state.width + 1 }, this.savedState.bind(this))}
      addRow={() => this.setState({ height: this.state.height + 1 }, this.savedState.bind(this))}
      move={this.handleMove.bind(this)}
      data={this.state.data}
    />;
  }
}

export default App;
