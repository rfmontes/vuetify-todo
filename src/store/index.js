import Vue from 'vue'
import Vuex from 'vuex'
import Localbase from 'localbase'

let db = new Localbase('db')
db.config.debug = false

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appTitle: process.env.VUE_APP_TITLE,
    search: null,
    tasks: [
      // {
      //   id: 1,
      //   title: 'Titulo 1',
      //   justification: 'Justificativa 1',
      //   done: false,
      //   dueDate: '2021-06-30'
      // },
      // {
      //   id: 2,
      //   title: 'Titulo 2',
      //   justification: 'Justificativa 2',
      //   done: false,
      //   dueDate: '2021-06-29'
      // },
      // {
      //   id: 3,
      //   title: 'Titulo 3',
      //   justification: 'Justificativa 3',
      //   done: false,
      //   dueDate: null
      // }
    ],
    snackbar: {
      show: false,
      text: ''
    },
    sorting: false
  },
  mutations: {
    setSearch(state, value) {
      state.search = value
    },

    addTask(state, newTask) {
      // let newTask = {
      //   id: Date.now(),
      //   title: newTaskTitle,
      //   justification: 'Justificativa',
      //   done: false
      // }
      state.tasks.push(newTask)
    },

    doneTask(state, id) {
      let task = state.tasks.filter(task => task.id === id)[0]
      task.done = !task.done
    },

    deleteTask(state, id) {
      state.tasks = state.tasks.filter(task => task.id !== id)
    },

    updateTask(state, payload) {
      let task = state.tasks.filter(task => task.id === payload.id)[0]
      task.title = payload.title
    },

    updateTaskDueDate(state, payload) {
      let task = state.tasks.filter(task => task.id === payload.id)[0]
      task.dueDate = payload.dueDate
    },

    setTasks(state, tasks) {
      state.tasks = tasks
    },

    showSnackbar(state, text) {
      let timeout = 0
      if (state.snackbar.show) {
        state.snackbar.show = false
        timeout = 300
      } 
      setTimeout(() => {
        state.snackbar.show = true
        state.snackbar.text = text     
      }, timeout);
    },

    hideSnackbar(state) {
      state.snackbar.show = false
    },

    toggleSorting(state) {
      state.sorting = !state.sorting
    }
  },
  actions: {
    addTask({ commit }, newTaskTitle) {
      let newTask = {
        id: Date.now(),
        title: newTaskTitle,
        justification: 'Justificativa',
        done: false
      }
      db.collection('tasks').add(newTask)
      commit('addTask', newTask)
      commit('showSnackbar', 'Task Added!')
    },
    doneTask({ state, commit }, id) {
      let task = state.tasks.filter(task => task.id === id)[0]
      db.collection('tasks').doc({ id: id }).update({
        done: !task.done
      }).then(() => {
        commit('doneTask', id)
      })
    },
    deleteTask({ commit }, id) {
      db.collection('tasks').doc({ id: id }).delete().then(() => {
        commit('deleteTask', id)
        commit('showSnackbar', 'Task Deleted!')
      })
    },
    updateTask({ commit }, payload) {
      db.collection('tasks').doc({ id: payload.id }).update({
        title: payload.title
      }).then(() => {
        commit('updateTask', payload)
        commit('showSnackbar', 'Task Updated!')
      })
    },
    updateTaskDueDate({ commit }, payload) {
      db.collection('tasks').doc({ id: payload.id }).update({
        dueDate: payload.dueDate
      }).then(() => {
        commit('updateTaskDueDate', payload)
        commit('showSnackbar', 'Due Date Updated!')
      })
    }, 
    setTasks({ commit }, tasks) {
      db.collection('tasks').set(tasks)
      commit('setTasks', tasks)
    },
    getTasks({ commit }) {
      db.collection('tasks').get().then(tasks => {
        commit('setTasks', tasks)
      })
    }
  },
  getters: {
    tasksFiltered(state) {
      if (!state.search) {
        return state.tasks
      }
      return state.tasks.filter(task => 
        task.title.toLowerCase().includes(state.search.toLowerCase())  
      )
    }
  }
})
