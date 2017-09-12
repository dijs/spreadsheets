import React, { Component } from 'react';
import Table from './Table';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      editing: undefined,
    };
  }
  handleChange(id, value) {
    this.setState({
      data: Object.assign({}, this.state.data, { [id]: value }),
    });
  }
  render() {
    return <Table
      width={5}
      height={10}
      editing={this.state.editing}
      handleChange={this.handleChange.bind(this)}
      handleFocus={id => this.setState({ editing: id })}
      handleBlur={() => this.setState({ editing: undefined })}
      data={this.state.data}
    />;
  }
}

export default App;
