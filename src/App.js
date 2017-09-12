import React, { Component } from 'react';
import Table from './Table';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleChange(id, value) {
    this.setState({ [id]: value });
  }
  render() {
    return <Table width={5} height={10} handleChange={this.handleChange.bind(this)} data={this.state} />;
  }
}

export default App;
