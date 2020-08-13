import React from 'react';
import './Create.css';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
      if (this.state.questions[index].type == "Multiple Select") {
        symbol = (<i class="fa fa-square-o" aria-hidden="true"></i>)
      } else if (this.state.questions[index].type == "Dropdown") {
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
              <button disabled={this.state.questions[index].options.length < 1} onClick={() => this.deleteOption(index, j)}>Delete</button>
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
            </tbody>
          </table>
          <input name="option" onChange={(e) => this.handleQuestionChange(e, index)} placeholder="Add Option" value={this.state.option}/>
          <button onClick={() => this.addOption(index)}>Add Option</button>
        </div>
      )

      //renders either short answer text or options
      var opts = (<p>Short Answer Text</p>)
      if (this.state.questions[index].type !== "Short Answer") {
        opts = choice
      } else {
        opts = (<p>Short Answer Text</p>)
      }

      return(
        <Draggable key={index} draggableId={"draggable"+index} index={index}>
        {(provided) => (
          <div index={index} id={index} key={index} {...provided.draggableProps} ref={provided.innerRef}>
            <hr/>
            <i {...provided.dragHandleProps} class="fa fa-bars" aria-hidden="true"></i>
            <p>{index}</p>
            <input name="name" onChange={(e) => this.handleQuestionChange(e, index)} value={this.state.questions[index].name}/>
            <br/>
            <select name="type" value={this.state.questions[index].type} onChange={(e) => this.handleQuestionChange(e, index)}>
              <option key="Short Answer" value="Short Answer">Short Answer</option>
              <option key="Multiple Choice" value="Multiple Choice">Multiple Choice</option>
              <option key="Multiple Select" value="Multiple Select">Multiple Select</option>
              <option key="Dropdown" value="Dropdown">Dropdown</option>
            </select>
            {opts}
            <button disabled={this.state.questions.length < 2} onClick={() => this.deleteQuestion(index)}>Delete Question</button>
            <hr/>
          </div>
        )}
        </Draggable>
      )
    })

    return (
      <div className="create">
        <h2>Create a New Form</h2>
        <div className="formInfo">
          <hr/>
            Form Title: <input name="title" onChange={this.handleChange} placeholder="Form Title" value={this.state.title}/>
            <br/>
            Form Description: <input name="description" onChange={this.handleChange} placeholder="Form Description" value={this.state.description}/>
          <hr/>
        </div>
        <div className="questions">
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
            {questions}
            {provided.placeholder}
            </div>
          )}
          </Droppable>
        </DragDropContext>
        <button onClick={this.addQuestion}>New Question</button>
        </div>
      </div>
    );
  }
}

export default Create;
