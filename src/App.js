import React, { Component } from 'react';
import Table from './Table';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    const saved = JSON.parse(localStorage.getItem('state') || {});
    this.state = {
      data: saved.data || {},
      editing: undefined,
      width: saved.width || 5,
      height: saved.height || 10,
    };
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
  render() {
    return <Table
      width={this.state.width}
      height={this.state.height}
      editing={this.state.editing}
      handleChange={this.handleChange.bind(this)}
      handleFocus={id => this.setState({ editing: id })}
      handleBlur={() => this.setState({ editing: undefined })}
      handleClear={() => this.setState({ data: {}, editing: undefined }, this.savedState.bind(this))}
      addColumn={() => this.setState({ width: this.state.width + 1 }, this.savedState.bind(this))}
      addRow={() => this.setState({ height: this.state.height + 1 }, this.savedState.bind(this))}
      data={this.state.data}
    />;
  }
}

export default App;
