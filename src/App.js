import React, { useState, useEffect } from 'react';
import './style.css';

const TABS = ['ALL', 'ACTIVE', 'COMPLETED'];

export default function App() {
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [activeTab, setActiveTab] = useState(TABS[0]);

  //------------------------------------------------------------
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setTodos(data.slice(0, 10));
      });
  }, []);

  //------------------------------------------------------------

  const renderTabs = () => {
    return TABS.map((tab) => {
      return (
        <button
          className={handleTabClassname(tab)}
          onClick={() => handleActiveTab(tab)}
          key={tab}
        >
          {tab}
        </button>
      );
    });
  };

  const handleActiveTab = (tabName) => {
    setActiveTab(tabName);
  };

  const handleTabClassname = (tabName) => {
    const activeTabName = tabName === activeTab ? 'active' : '';
    return `tab ${activeTabName}`;
  };

  //------------------------------------------------------------

  const handleTodo = () => {
    const todo = {
      id: new Date().valueOf(),
      title: input,
      completed: false,
    };
    const newTodo = [...todos, todo];
    setTodos(newTodo);
    setInput('');
  };

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleDelete = (todoId) => {
    const newTodo = todos.filter((todo) => {
      return todo.id !== todoId;
    });
    setTodos(newTodo);
  };

  const handleToggleCheckbox = (todoId) => {
    const newTodo = todos.map((todo) => {
      if (todo.id === todoId) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      }
      return todo;
    });
    setTodos(newTodo);
  };

  //------------------------------------------------------------

  const handleCancel = () => {
    setEditId(null);
    setEditValue('');
  };

  const handleEditValue = (e) => {
    setEditValue(e.target.value);
  };

  const handleEdit = (todoId, title) => {
    setEditId(todoId);
    setEditValue(title);
  };

  const handleSave = (todoId) => {
    const newTodo = todos.map((todo) => {
      if (todo.id === todoId) {
        return {
          ...todo,
          title: editValue,
        };
      }
      return todo;
    });
    setTodos(newTodo);
    setEditId(null);
    setEditValue('');
  };

  //------------------------------------------------------------

  const handleTodoList = () => {
    return todos
      .filter((todo) => {
        if (activeTab === 'ALL') {
          return true;
        } else if (activeTab === 'ACTIVE') {
          return !todo.completed;
        } else {
          return todo.completed;
        }
      })
      .map((todo) => {
        if (editId === todo.id) {
          return (
            <div key={todo.id}>
              <input type="text" value={editValue} onChange={handleEditValue} />
              <button onClick={() => handleSave(todo.id)}>SAVE</button>
              <button onClick={handleCancel}>CANCEL</button>
            </div>
          );
        } else {
          return (
            <div key={todo.id}>
              <li>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleCheckbox(todo.id)}
                />
                <span className={todo.completed ? 'strike' : ''}>
                  {todo.title}
                </span>
                <button onClick={() => handleEdit(todo.id, todo.title)}>
                  EDIT
                </button>
                <button onClick={() => handleDelete(todo.id)}>DELETE</button>
              </li>
            </div>
          );
        }
      });
  };
  return (
    <div>
      <h1>Hello StackBlitz!</h1>
      <p>The complete Todo List :)</p>
      <input type="text" onChange={handleInput} value={input} />
      <button onClick={handleTodo}>ADD</button>
      <ul>{handleTodoList()}</ul>
      <div className="btn-group">{renderTabs()}</div>
    </div>
  );
}
