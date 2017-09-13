import React, { Component } from 'react';
import Table from './Table';
import { buildCSV, authorizeDrive, uploadCSV } from './utils';
import './App.css';

function getSavedState() {
  return JSON.parse(localStorage.getItem('state') || '{}');
}

const defaultState = {
  data: {},
  active: undefined,
  width: 5,
  height: 10,
  uploading: false,
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
  handleExport() {
    this.setState({ uploading: true });
    const csv = buildCSV(this.state.width, this.state.height, this.state.data);
    return authorizeDrive(() => uploadCSV(csv, () => this.setState({ uploading: false })));
  }
  renderTable() {
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
  render() {
    return <div>
      {this.renderTable()}
      {
        this.state.uploading
        ? "Exporting..."
        : <button onClick={this.handleExport.bind(this)}>Export to Google Drive</button>
      }
    </div>;
  }
}

export default App;
