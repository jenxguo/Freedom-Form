import React from 'react';
import './Viewer.css';

import {Link} from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'redux';

class Viewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  saveResult = () => {
    const userKey = this.props.firebase.push(`/results/${this.props.formId}/data`).key;
    var results = this.state;
    for (var key in results) {
      if (results[key] instanceof Set) {
        results[key] = Array.from(results[key])
      }
    }
    const onComplete = () => {
      console.log('results updated');
      this.props.history.push(`/results/${this.props.formId}`);
    }
    const updates = {};
    updates[`/results/${this.props.formId}/data/${userKey}`] = results;
    this.props.firebase.update(`/`, updates, onComplete);
  }

  //general handle change function with name property, need to use square bracket []
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  //adds/removes checked boxes to set
  handleCheckboxChange = event => {
    if (event.target.checked) {
      if (!this.state.[event.target.name]) {
        const set = new Set();
        set.add(event.target.value)
        this.setState({ [event.target.name]: set })
      } else {
        const update = this.state.[event.target.name].add(event.target.value);
        this.setState({ [event.target.name]: update });
      }
    } else {
        this.state.[event.target.name].delete(event.target.value)
    }
  }

  //checks if form is filled
  isfilled() {
    for (var i = 0; i < this.props.questions.length; i++){
      if (!this.state.[this.props.questions[i].name]) {
        return true;
      }
      if (this.props.questions[i].type === "Dropdown") {
        if (this.state.[this.props.questions[i].name] === "--") {
          return true;
        }
      }
    }
    return false;
  }

  render() {
    if (!isLoaded(this.props.form)) {
      return <div>Loading...</div>
    }

    if (isEmpty(this.props.form)) {
      return <div>Page not found</div>
    }

    //render each question in the form
    const questions = this.props.questions.map((question, index) => {

      const name = question.name;
      const type = question.type;

      //render options
      const options = this.props.questions[index].options.map((option, j) => {
        if (type === "Dropdown") {
          return (
            <option key={j}>{option}</option>
          );
        } else if (type === "Multiple Choice") {
            return (
              <div>
                <input type="radio" onChange={this.handleChange} key={j} name={name} value={option}/> {option}
              </div>
            );
        } else if (type === "Multiple Select") {
            return (
              <div>
                <input type="checkbox" name={name} value={option} onChange={this.handleCheckboxChange}/> {option}
              </div>
            );
        } else {
          return (<div></div>)
        }
      });

      //render based on type of question
      var input = (
        <div class="form-group">
          <div className="card-header">
            <label for={"question" + index}>{name}</label>
          </div>
          <div className="input">
            <textarea className="border-0" placeholder="Begin typing here." name={name} value={this.state.[name]} onChange={this.handleChange} class="form-control" id={"input" + index} rows="2"></textarea>
          </div>
        </div>
      )
      if (type === "Short Answer") {
        input = (
          <div class="form-group">
            <div className="card-header">
              <label for={"question" + index}>{name}</label>
            </div>
            <div className="input">
              <textarea className="border-0" placeholder="Begin typing here." name={name} value={this.state.[name]} onChange={this.handleChange} class="form-control" id={"input" + index} rows="2"></textarea>
            </div>
          </div>
        )
      } else if (type === "Multiple Choice") {
        input = (
          <div class="form-group">
            <div className="card-header">
              <label for={"question" + index}>{name}</label>
            </div>
            <div className="input">
              {options}
            </div>
          </div>
        )
      } else if (type === "Multiple Select") {
        input = (
          <div class="form-group">
            <div className="card-header">
              <label for={"question" + index}>{name}</label>
            </div>
            <div className="input">
              {options}
            </div>
          </div>
        )
      } else if (type === "Dropdown") {
        input = (
          <div class="form-group">
            <div className="card-header">
              <label for={"question" + index}>{name}</label>
            </div>
            <div className="input">
              <select name={name} value={this.state.[name]} onChange={this.handleChange} class="form-control" id={"input" + index}>
                <option>--</option>
                {options}
              </select>
            </div>
          </div>
        )
      }

      return(
        <div key={index} className="card rounded" style={{width: "50em"}}>
          {input}
        </div>
      )
    });

    return (
      <div className='Viewer'>
        <div className="color border-0 rounded">
          <h1 className="title">"{this.props.title}"</h1>
          <h5>{this.props.description}</h5>
          <Link to={`/results/${this.props.formId}`}>View Results</Link>
          <p>Send this form to your friends! Link: <i>{`www.freedom-form.web.app/form/${this.props.formId}`}</i></p>
        </div>
        <div className="white">
          <form>
            {questions}
            <button className="create rounded btn btn-primary" onClick={this.saveResult} disabled={this.isfilled()}>Submit</button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const form = state.firebase.data[props.match.params.formId];
  const title = form && form.title;
  const description = form && form.description;
  const questions = form && form.questions;
  return {
    title: title,
    description: description,
    questions: questions,
    form: form,
    formId: props.match.params.formId,
  };
}

export default compose(
  withRouter,
  firebaseConnect(props => {
    const formId = props.match.params.formId;
    return [{path: `/forms/${formId}`, storeAs: formId}];
  }),
  connect(mapStateToProps))(Viewer);
