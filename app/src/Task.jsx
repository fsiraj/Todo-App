import React from "react";
import "./styles/Task.css"
import doneIcon from "./icons/Done.png"
import resetIcon from "./icons/Reset.png"
import deleteIcon from "./icons/Delete.png"
import editIcon from "./icons/Edit.png"

class Task extends React.Component {
    // An individual task in the list

    constructor(props) {
        super(props);
        this.state = {
            id: -1,
            task: '',
            done: false,
            added: '',
            edited: '',
            editMode: false
        };

        this.updateTaskStatus = this.updateTaskStatus.bind(this);
        this.updateTaskDescription = this.updateTaskDescription.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.enableEditMode = this.enableEditMode.bind(this);

        this.input = React.createRef();
    }

    componentDidMount() {
        const data = this.props.data;
        this.setState({
            id: data.id,
            task: data.task,
            done: data.done,
            added: data.added,
            edited: data.edited
        });
    }

    deleteTask(id) {
        this.props.deleteTask(id);
    }

    updateTaskStatus(id) {
        // Update state of component and update database
        const newStatus = !this.state.done;
        const task = this.state.task;
        // Redundant but immediate
        this.setState((prevState) => {
            return { done: !prevState.done }
        });
        this.props.editTask(task, newStatus, id);
    }

    enableEditMode() {
        this.setState({ editMode: true })
    }

    updateTaskDescription(id) {
        // Make sure both events don't trigger this
        if (this.state.editMode) {
            const newTaskDesc = this.input.current.value;
            const done = this.state.done;
            // Redundant but immediate
            this.setState({
                task: newTaskDesc,
                editMode: false
            });
            this.props.editTask(newTaskDesc, done, id);
        }
    }

    render() {
        const { id, task, done, added, edited, editMode } = this.state;
        const doneImgSrc = (done) ? resetIcon : doneIcon;
        return (
            <tr className={(done) ? "completed" : ""}>
                <td className={(done) ? "completed" : ""}>
                    {(editMode)
                        ? <input
                            type="text"
                            name="taskDesc"
                            defaultValue={task}
                            ref={this.input}
                            onBlur={() => this.updateTaskDescription(id)}
                            onKeyPress={(e) => (e.key === 'Enter') ? this.updateTaskDescription(id) : null}
                        />
                        : task
                    }
                </td>
                <td className="datetime">{added}</td>
                <td className="datetime">{edited}</td>
                {/* Button to mark task as done or reset to undone */}
                <td className="button-cell">
                    {/* Could make this a component */}
                    <input
                        type="image"
                        src={doneImgSrc}
                        alt={(done) ? "mark not done" : "mark done"}
                        id={(done) ? "reset-icon" : "mark-done-icon"}
                        onClick={() => this.updateTaskStatus(id)}
                    />
                </td>
                {/* Button to edit task */}
                <td className="button-cell">
                    <input
                        type="image"
                        src={editIcon}
                        alt="edit task"
                        id="edit-icon"
                        onClick={this.enableEditMode}
                    />
                </td>
                {/* Button to delete task */}
                <td className="button-cell">
                    <input
                        type="image"
                        src={deleteIcon}
                        alt="delete task"
                        id="delete-icon"
                        onClick={() => this.deleteTask(id)}
                    />
                </td>
            </tr>
        )
    }
}

export default Task