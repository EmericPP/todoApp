import React, { useState, useEffect } from 'react';
import './App.scss';
import axios from 'axios'
import {keyEnterIsPressed} from "./utils/events/keyboardEvents";

const getTodolistsRequest = () => {
  return axios.get('http://localhost:3000/api/v1/todolists/')
}
const getTasksRequest = (todolistId) => {
  return axios.get(`http://localhost:3000/api/v1/tasks?${todolistId ? `todolistId=${todolistId}` : ''}`)
}

const addTasksRequest = (title, todolistId) => {
  return axios.post(`http://localhost:3000/api/v1/tasks?`, {
      todolistId: todolistId,
      title: title
  })
}

const App = () => {

  const [todos, setTodos] = useState([])
  const [currentTodo, selectTodo] = useState("")
  const [tasks, setTasks] = useState([])

  const getTodosTasks = (id) => {
    getTasksRequest(id).then(({data}) => {
      setTasks(data.result)
      selectTodo(id)
    })
  }


  useEffect(() => {
    (async function() {
      const firstTodoId =  await getTodolistsRequest().then(({data}) => {
        setTodos(data.result)
        return data.result[0].id
      })
      getTodosTasks(firstTodoId)
    })()
  }, [])

  return (
      <div className="App">
        <main className="todolists-container">
          <ul className="todolists-container__todos">
            {todos.map(({id, title}) => (
                <li key={id} className="todolists__todo">
                  <button
                     onClick={() => getTodosTasks(id)}
                     className={`todolists__todo-btn ${currentTodo === id ? 'todolists__todo-btn--selected' : ''}`}
                  >{title}</button>
               </li>
           ))}
          </ul>
          <ul className="todolists-container__tasks">
            {tasks.map(({id, title}) => (
               <li key={id} className="todolists__task">{title}</li>
            ))}
            <li>
              <input
                type="text"
                placeholder="Ajouter une tache"
                onKeyPress={(e) => keyEnterIsPressed(e) && addTasksRequest(e.target.value, currentTodo).then(({data}) => {
                  setTasks([...tasks, data.result])
                })}
              />
            </li>
          </ul>
       </main>
      </div>
  )
}



export default App;