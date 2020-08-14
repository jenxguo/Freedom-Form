import React from 'react';
import './Create.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { withRouter } from 'react-router-dom';
import { firebaseConnect } from 'react-redux-firebase';
import { compose } from 'redux';

class Create extends React.Component {
  constructor(props) {
    super(props);
    //just storing input in state
    this.state = {
      title: '',
      description: '',
      questions: [
        {
          name: 'Untitled Question',
          type: 'Short Answer',
          options: ['Option 1',],
          option: '',
        }
      ],
    }
  };

  createForm = () => {
    const formId = this.props.firebase.push('/forms').key;
    const newForm = {title: this.state.title, description: this.state.description, questions: this.state.questions};
    const onComplete = () => {
      console.log('database updated with new form!');
      this.props.history.push(`/form/${formId}`);
    };
    const updates = {};
    updates[`/forms/${formId}`] = newForm;
    //if want to do results, push to results here too
    this.props.firebase.set(`/results/${formId}`, {title: this.state.title})
    this.props.firebase.update(`/`, updates, onComplete);
  }

  //general handle change function with name property, need to use square bracket []
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleQuestionChange = (event, index) => {
    const questions = [...this.state.questions];
    const param = event.target.name
    questions[index].[param] = event.target.value;
    this.setState({questions})
  }

  handleOptionChange = (event, index, j) => {
    const questions = [...this.state.questions];
    const options = [...questions[index].options];
    var option = options[j];
    option = event.target.value;
    options[j] = option;
    questions[index].options = options;
    this.setState({questions})
  }

  addQuestion = () => {
    const newQ = {
      name: 'Untitled Question',
      type: 'Short Answer',
      options: ['Option 1',],
      option: '',
    }
    const questions = [...this.state.questions].slice().concat(newQ);
    this.setState({questions})
  }

  deleteQuestion = index => {
    const questions = [...this.state.questions];
    questions.splice(index, 1);
    this.setState({questions})
  }

  addOption = (index) => {
    const option = this.state.questions[index].option;
    if (option.trim()) {
      const questions = [...this.state.questions];
      const options = questions[index].options.slice().concat(option);
      questions[index].options = options;
      questions[index].option = '';
      this.setState({questions})
    }
  }

  deleteOption = (index, j) => {
    const questions = [...this.state.questions];
    const options = questions[index].options.slice();
    options.splice(j, 1);
    questions[index].options = options;
    this.setState({questions})
  }

  onDragEnd = param => {
    const questions = [...this.state.questions];
    const srcI = param.source.index;
    const desI = param.destination.index;
    questions.splice(desI, 0, questions.splice(srcI, 1)[0]);
    this.setState({questions})
  }

  render () {

    //render list of questions
    const questions = this.state.questions.map((question, index) => {

      //symbol matching
      var symbol = (<i class="fa fa-circle-thin" aria-hidden="true"></i>)
      if (this.state.questions[index].type === "Multiple Select") {
        symbol = (<i class="fa fa-square-o" aria-hidden="true"></i>)
      } else if (this.state.questions[index].type === "Dropdown") {
        symbol = (<i class="fa fa-caret-down" aria-hidden="true"></i>)
      } else {
        symbol = (<i class="fa fa-circle-thin" aria-hidden="true"></i>)
      }

      //render table of options
      const options = this.state.questions[index].options.map((option, j) => {
        return(
          <tr key={j}>
            <td>{symbol}</td>
            <td><input value={this.state.questions[index].options[j]}onChange={(e) => this.handleOptionChange(e, index, j)}/></td>
            <td>
              <button className="btn btn-secondary" disabled={this.state.questions[index].options.length < 1} onClick={() => this.deleteOption(index, j)}><i class="fa fa-times" aria-hidden="true"></i></button>
            </td>
          </tr>
        )
      })

      //add an option
      const choice = (
        <div>
          <table>
            <tbody>
              {options}
              <tr>
                <td>{symbol}</td>
                <td><input name="option" onChange={(e) => this.handleQuestionChange(e, index)} placeholder="Add Option" value={this.state.questions[index].option}/></td>
                <td><button disabled={!this.state.questions[index].option.trim()} className="btn btn-primary" onClick={() => this.addOption(index)}><i class="fa fa-plus" aria-hidden="true"></i></button></td>
              </tr>
            </tbody>
          </table>
        </div>
      )

      //renders either short answer text or options
      var opts = (<p className="float-left text-muted">Short Answer Text</p>)
      if (this.state.questions[index].type !== "Short Answer") {
        opts = choice
      } else {
        opts = (<p className="float-left text-muted">Short Answer Text</p>)
      }

      return(
        <Draggable key={index} draggableId={"draggable"+index} index={index}>
        {(provided) => (
          <div index={index} id={index} key={index} {...provided.draggableProps} ref={provided.innerRef}>
            <div className="card rounded" style={{width: "50em"}}>
            <div className="card-header">
            <div className="float-right horizontal">
            <i {...provided.dragHandleProps} class="fa fa-bars" aria-hidden="true"></i>
            <button className="btn btn-danger small" disabled={this.state.questions.length < 2} onClick={() => this.deleteQuestion(index)}><i class="fa fa-trash" aria-hidden="true"></i></button>
            </div>
            <input className="float-left border-0 rounded" name="name" onChange={(e) => this.handleQuestionChange(e, index)} value={this.state.questions[index].name}/>
            </div>
            <div className="card-body">
            <select className="float-right border-light rounded" name="type" value={this.state.questions[index].type} onChange={(e) => this.handleQuestionChange(e, index)}>
              <option key="Short Answer" value="Short Answer">Short Answer</option>
              <option key="Multiple Choice" value="Multiple Choice">Multiple Choice</option>
              <option key="Multiple Select" value="Multiple Select">Multiple Select</option>
              <option key="Dropdown" value="Dropdown">Dropdown</option>
            </select>
            {opts}
            </div>
            </div>
          </div>
        )}
        </Draggable>
      )
    })

    return (
      <div className="create">
        <div className="color border-0 rounded">
          <h2 className="title">Create a New Form</h2>
        </div>
        <div className="white">
        <br/>
        <div className="center">
          <div className="formInfo">
              <div className="vert-space">
              <input className="border-primary rounded" style={{width: "40em"}} name="title" onChange={this.handleChange} placeholder="Form Title" value={this.state.title}/>
              </div>
              <div className="vert-space">
              <input className="border-primary rounded" style={{width: "40em"}} name="description" onChange={this.handleChange} placeholder="Form Description" value={this.state.description}/>
              </div>
          </div>
          <hr/>
        </div>
        <div className="questions">
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
          {(provided) => (
            <div className="center" ref={provided.innerRef} {...provided.droppableProps}>
            {questions}
            {provided.placeholder}
            </div>
          )}
          </Droppable>
        </DragDropContext>
        <button className="rounded btn btn-light" onClick={this.addQuestion}>New Question</button>
        </div>
        <br/>
        <button className="create rounded btn btn-primary" disabled={!this.state.title || this.state.questions.length < 1}onClick={this.createForm}>Create Form</button>
        </div>
      </div>
    );
  }
}

export default compose(firebaseConnect(), withRouter)(Create);
