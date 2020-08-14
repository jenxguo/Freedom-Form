import React from 'react';
import './Results.css';

import { withRouter, Link } from 'react-router-dom';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'redux';

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  //general handle change function with name property, need to use square bracket []
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    if (!isLoaded(this.props.results)) {
      return <div>Loading...</div>
    }

    if (isEmpty(this.props.data)) {
      return <div>No results yet!</div>
    }

    const data = Object.keys(this.props.data).map((person, index) => {
      return (
        <tr key={person}>
          <td>{index + 1}</td>
          {Object.keys(this.props.data[person]).map((question, j) => {
            return (<td key={j}>{this.props.data[person][question]}</td>)
          })}
        </tr>
      )
    });

    const person = this.props.data[Object.keys(this.props.data)[0]];

    const head = Object.keys(person).map((question, index) => {
      return (<th key={index}>{question}</th>)
    });

    return (
      <div className='Results'>
        <div className="color border-0 rounded">
          <h1 className="title">"{this.props.title}" Results</h1>
          <p>Send this form to your friends! Link: <i>{`www.freedom-form.web.app/form/${this.props.formId}`}</i></p>
          <Link to={`/form/${this.props.formId}`}>Go Back</Link>
          <br/>
          <Link to={`/create`}>Create a New Form</Link>
        </div>
        <div className="white">
          <div className="card rounded" style={{width: "50em"}}>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>Submission</th>
                  {head}
                </tr>
              </thead>
              <tbody>
                {data}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const results = state.firebase.data[props.match.params.formId];
  const title = results && results.title;
  const data = results && results.data;
  return {
    results: results,
    title: title,
    data: data,
    formId: props.match.params.formId,
  };
}

export default compose(
  withRouter,
  firebaseConnect(props => {
    const formId = props.match.params.formId;
    return [{path: `/results/${formId}`, storeAs: formId}];
  }),
  connect(mapStateToProps))(Results);
