import React from 'react';
import './bulma.css';

// using these styles/classes as variables to reduce duplication
// and also to make it easier to understand the intent of the code

const visibleTodoDiv = { gridArea: "1 / 1 / 2 / 2", alignContent: "center",  display: "flex", flexWrap: "wrap"};
const hiddenTodoDiv = {visibility:"hidden", gridArea: "1 / 1 / 2 / 2"};
const baseTodoItemClasses = "content is-large notification ml-3 mr-3 ";
const baseEditTodoItemClasses = "notification mb-5 ml-3 mr-3 is-primary ";

const TodoItem = (props) => {
    
    let todoItemStyle = visibleTodoDiv;
    let editTodoItemStyle = hiddenTodoDiv;

    let todoItemClasses = baseTodoItemClasses;
    let editTodoItemClasses = baseEditTodoItemClasses;
    let currentTodoRef = null;
    let completedTodoStyle = null;

    // checks if we've entered an "edit mode" or not and shows the correct div accordingly

    if (props.editingTodoItem && props.currentTodoItemId === props.id) {
      todoItemStyle = hiddenTodoDiv;
      editTodoItemStyle = visibleTodoDiv;
      currentTodoRef = props.todoInputRef;
    }

    // on ticking the complete checkbox, strikes through and sets the text to italic

    if (props.completed) {
        completedTodoStyle = {textDecoration: "line-through", fontStyle: "italic"}
    }

    // changes the background color if hovering over an item directly, or its delete button

    if (props.hoverDelete  && props.currentTodoItemId === props.id) {
        todoItemClasses = baseTodoItemClasses + "is-danger";
    }  else if (props.hoverItem  && props.currentTodoItemId === props.id && !props.editingTodoItem ){
        todoItemStyle = {...todoItemStyle, backgroundColor : "#00dcbb"};
    } else {
        todoItemClasses = baseTodoItemClasses + "is-primary";
    }



    return (

        // this is the magic that allows us to display one div directly on top of another
        // we do this in order to switch from a display "mode" with a label to an edit "mode"
        // with an input field

        <div style={{display: "grid",  gridTemplateColumns: "1fr", gridTemplateRows: "1fr"}}>

            {/* this is the "default" display div, it shows a label with the todo item the user added */}

            <div
                onMouseOver={(event, id) => props.onMouseOverItem(event, props.id)}
                onMouseLeave={props.onMouseLeaveItem}
                className={todoItemClasses} style={todoItemStyle}>
                <input
                    onChange={(event, id) => props.onCompleteHandler(event, props.id)}
                    checked={props.completed}
                    className="mr-5" type="checkbox" />
                <label style={completedTodoStyle} 
                       onDoubleClick={(event, id) => props.onDoubleClickHandler(event, props.id)}
                       onTouchEndCapture={(event, id) => props.onDoubleClickHandler(event, props.id)}
                >
                    {props.todoItem}
                </label>
                <button
                    onClick={(event, id) => props.onDeleteToDo(event, props.id)}
                    onMouseOver={(event, id) => props.onMouseOverDelete(event, props.id)}
                    onMouseLeave={props.onMouseLeaveDelete}
                    className="delete">
                </button>
            </div>

            {/* this is hidden until a user double clicks on the label of the todo item to edit it, then it becomes visible and the other hidden */}


            <div className={editTodoItemClasses} style={editTodoItemStyle}>
                <input className="input is-large "
                   ref={currentTodoRef}
                   onBlur={props.onToDoCompletionHandler}
                   onKeyDown={props.onToDoCompletionHandler}
                   onChange={(event, id) => props.onInputChangeHandler(event, props.id)}
                   value={props.todoItem}
                />
            </div>

        </div>
    );
};
export default TodoItem;