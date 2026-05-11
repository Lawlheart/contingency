import { useEffect } from 'react'
import './App.css'
import Pokedex from './components/Pokedex'
import {loadTurso } from './helpers/turso'


function App() {

  useEffect(() => {
    async function runLoadTurso() {
      loadTurso()
    }

    runLoadTurso()
  }, [])

  return (
    <Pokedex />
  )
}

export default App
