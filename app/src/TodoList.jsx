import React from 'react';
import Task from './Task';
import Form from './Form';
import './styles/TodoList.css';

class App extends React.Component {
  // Top-Level App

  constructor(props) {
    super(props);
    this.state = {
      tasks: {},
    };
    this.addTask = this.addTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.editTask = this.editTask.bind(this);
  }

  componentDidMount() {
    const url = "http://localhost:8888/";
    fetch(url, { credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        this.setState({
          tasks: data.tasks
        });
      })
      .catch((error) => console.log(error));
  }

  addTask(taskText) {
    // Adds task to database and renders
    const url = "http://localhost:8888/add"
    const options = {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskText }),
    };

    fetch(url, options)
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        const newId = data.id;
        delete data.id;
        const newTask = { [newId]: data };
        this.setState((prevState) => {
          return { tasks: { ...newTask, ...prevState.tasks } }
        })
      })
      .catch((error) => console.log(error));
  }

  deleteTask(id) {
    // Deletes task and update database
    const url = `http://localhost:8888/delete?id=${id}`;
    const options = {
      method: 'DELETE',
      credentials: 'same-origin',
    };

    fetch(url, options)
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
      })
      .catch((error) => console.log(error));

    this.setState((prevState) => {
      delete prevState.tasks[id];
      return { tasks: prevState.tasks }
    })
  }

  editTask(newDesc, newStatus, id) {
    // Update state and database, using this for both status and description
    const url = `http://localhost:8888/edit?id=${id}`;
    const options = {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ desc: newDesc, status: newStatus }),
    };

    fetch(url, options)
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        const changedId = data.id;
        delete data.id;
        this.setState((prevState) => {
          delete prevState[[changedId]];
          return { tasks: { [changedId]: data, ...prevState.tasks } }
        })
      })
      .catch((error) => console.log(error));
  }

  render() {
    const { tasks } = this.state;
    return (
      <div id="todolist">
        <h1 id='title'>To-Do List</h1>
        <Form addTask={this.addTask} />
        <table>
          <thead>
            <tr>
              <th className="task-col">Task</th>
              <th className="date-col">Added</th>
              <th className="date-col">Edited</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(tasks).map((id) =>
              <Task
                key={id}
                data={{ 'id': id, ...tasks[id] }}
                deleteTask={this.deleteTask}
                editTask={this.editTask}
              />
            )}
          </tbody>
        </table>
      </div>
    );
  }

}

export default App;
