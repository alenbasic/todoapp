import React, { Component } from 'react';
import {isMobile} from 'react-device-detect';
import TodoItem from './TodoItem';
import './bulma.css';

class Todolist extends Component {
  
    state = {
        todoItems: [],
        editingTodoItem: false,
        currentTodoItemId: null,
        newToDo: '',
        hoverDelete: false,
        hoverItem: false,
      }

      // refs used to set focus when adding todos or editing one of them

      currentToDoRef = React.createRef();
      addToDoItemRef = React.createRef();
      helpText = "Double click on a to-do to edit it!"

      //  load todos if we have uses the application previously

      componentDidMount() {
        this.addToDoItemRef.current.focus();
        let todoItems = localStorage.getItem('todoItems');

        if (todoItems) {
          this.setState({
            todoItems: JSON.parse(todoItems)
          });
        }
      }

      // set the focus on the right component, and update the local storage with the current todos

      componentDidUpdate() {
        if (this.state.editingTodoItem){
          this.currentToDoRef.current.focus();
        } else {
          this.addToDoItemRef.current.focus();
        }
        localStorage.setItem('todoItems', JSON.stringify(this.state.todoItems));
      }

      // when a user updates a todo, we find it in the list and update it

      onInputChangeHandler = (event, todoId) => {

        const todoListCopy = [...this.state.todoItems];
        let modifiedTodoList = []
         todoListCopy.forEach( todo => {
          if (todo.id === todoId) {
            todo.task = event.target.value;
          }
          modifiedTodoList.push(todo);
        });
        this.setState({todoItems: modifiedTodoList});
      }

      // when a user is in "edit mode" these are the ways they can exit out of it

      onToDoCompletionHandler = (event) => {

        if (event.key === 'Enter' || event.type === 'blur' || event.key === 'Escape') {
          this.setState({
              editingTodoItem: false,
              currentTodoItemId: null
            });
        }
      }

      // enters an "edit mode" on a todo item

      onDoubleClickHandler = (event,todoId) => {
        this.setState(
          {
            editingTodoItem: true,
            currentTodoItemId: todoId
          }
        );
      }

      // saves the current value of new the todo being entered

      onNewToDoHandler = (event) => {

        this.setState({
          newToDo: event.target.value
        })

      }

      // creates a new todo and  adds it to the list

      onToDoAddHandler = (event) => {

        if (event.key === 'Enter') {
          const todoListCopy = [...this.state.todoItems];
          todoListCopy.push({
            id: Math.floor(Math.random()*10000),
            task: event.target.value,
            completed: false
          });
          this.setState({
              todoItems: todoListCopy,
              newToDo: ''
            });
        }
      }

      // searches for the current todo and toggles the completion checkbox

      onCompleteHandler = (event, todoId) => {
        let modifiedTodoList = []
         this.state.todoItems.forEach( todo => {
          if (todo.id === todoId) {
            let modifiedTodo = {...todo}
            modifiedTodo.completed = !modifiedTodo.completed;
            modifiedTodoList.push(modifiedTodo);
          } else {
            modifiedTodoList.push(todo);
          }

        });
        this.setState({todoItems: modifiedTodoList});
      }

      // deletes the todo

      onDeleteToDo = (event, todoId) => {
        this.setState({todoItems:
                          this.state.todoItems
                         .filter( todo => todo.id !== todoId),
            hoverDelete: false,
            currentTodoItemId: null
        });
      }

    // used to change the color of the todo item when hovering over the delete button

    onMouseOverDelete = (event, todoId) => {
      this.setState({
          hoverDelete: true,
          currentTodoItemId: todoId
      });
}

    // sets back to the default color when leaving the delete button

    onMouseLeaveDelete = (event) => {
        this.setState({
            hoverDelete: false,
            currentTodoItemId: null
        });
    }

    // used to slightly change the todo item color to show which item is currently being interacted with

    onMouseOverItem = (event, todoId) => {
        if (!this.state.editingTodoItem)  {
            this.setState({
                hoverItem: true,
                currentTodoItemId: todoId
            });
        }

    }

    // sets back to the default color when leaving the item

    onMouseLeaveItem = (event) => {
        this.setState({
            hoverItem: false
        });
    }

    render() {

        // renders a list of todo components to be rendered in the list

        if (isMobile) {
          this.helpText = "Tap on a to-do to edit it!";
        }

        const todoItems = this.state.todoItems.map(todo => {
            return ( <TodoItem
               id={todo.id}
               completed={todo.completed}
               key={todo.id}
               todoItem={todo.task}
               todoInputRef={this.currentToDoRef}
               editingTodoItem={this.state.editingTodoItem}
               currentTodoItemId={this.state.currentTodoItemId}
               onDoubleClickHandler={this.onDoubleClickHandler}
               onToDoCompletionHandler={this.onToDoCompletionHandler}
               onInputChangeHandler={this.onInputChangeHandler}
               onCompleteHandler={this.onCompleteHandler}
               onDeleteToDo={this.onDeleteToDo}
               onMouseOverDelete={this.onMouseOverDelete}
               onMouseLeaveDelete={this.onMouseLeaveDelete}
               hoverDelete={this.state.hoverDelete}
               hoverItem={this.state.hoverItem}
               onMouseOverItem={this.onMouseOverItem}
               onMouseLeaveItem={this.onMouseLeaveItem}

            />)
           });

          return (
              <section>

                  <div className="columns mt-5">
                  <div style={{paddingBottom: "0"}} className="column is-three-fifths is-offset-one-fifth notification is-info">
                    <input  ref={this.addToDoItemRef} className="input has-text-centered mb-5 is-large" placeholder="What is on your to-do list?" onChange={this.onNewToDoHandler} onKeyDown={this.onToDoAddHandler} value={this.state.newToDo}  />
                      {todoItems}
                  </div>
                  </div>
                  <div className="mt-5 column is-one-third is-offset-one-third notification has-text-centered is-success" >{this.helpText}</div>

              </section>

          );
        }
    
    
}

export default Todolist;