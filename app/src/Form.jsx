import React from "react";
import "./styles/Form.css"
import addIcon from "./icons/Add.png"

class Form extends React.Component {
    // Form to add new tasks
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.input = React.createRef();
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.addTask(this.input.current.value);
        this.input.current.value = "";
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    name="newtask"
                    id="task-input"
                    placeholder="anything new to do?"
                    ref={this.input}
                    required
                />
                <input
                    type="image"
                    name="submit"
                    src={addIcon}
                    alt="add task"
                    id="submit-input"
                />
            </form>
        )
    }
}

export default Form;