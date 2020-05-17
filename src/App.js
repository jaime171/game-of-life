import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';
import './App.css';
import 'materialize-css/dist/css/materialize.min.css'
import links from './links'
import {
  NUM_ROWS as numRows,
  NUM_COLS as numCols,
  TIMEOUT as timeout,
  RANDOM_PROBABILITY as randomProbability,
  CELL_SIZE as cellSize
} from './config'

/*
=== GRID OPERATIONS ===
[-1, -1][-1, 0][-1, 1]
[0, -1][currentIndex][0, 1]
[1, -1][1, 0][1, 1]
*/
const operations = [
  [0, 1],
  [0, -1],
  [1, 0],
  [1, 1],
  [1, -1],
  [-1, 0],
  [-1, 1],
  [-1, -1],
]

const generateGrid = ({ initValue, isRandom = false }) => {
  // initial state of the game
  const rows = []
  for (let i = 0; i < numRows; i++) {
    // array.from first param is the iterable object and the second y a mapping function so you can initalize the values of the array
    rows.push(Array.from(Array(numCols), () => !isRandom
      ? initValue
      : Math.random() > randomProbability ? 1 : 0)
    )
  }
  return rows
}

const App = () => {
  const [generation, setGeneration] = useState(0)
  const [grid, setGrid] = useState(() => generateGrid({ initValue: 0 }));

  const [running, setRunning] = useState(false)
  // useRef return a mutable object can be stored in .current if the value asiggedn to .current changes then would run every function where .current property is used
  const runningRef = useRef(running)
  runningRef.current = running

  const runSimulation = useCallback(
    () => {
      if (!runningRef.current) {
        return;
      }

      setGrid(g => {
        // import produce to avid mutate the grid, instead returns
        // a copy and mutate the copy and that would update the grid
        return produce(g, gridCopy => {
          for (let i = 0; i < numRows; i++) {
            for (let k = 0; k < numCols; k++) {
              let neighbors = 0
              // with this we get the total of neighbors
              operations.forEach(([x, y]) => {
                const newI = i + x
                const newk = k + y
                if (newI >= 0 && newI < numRows && newk >= 0 && newk < numCols) {
                  neighbors += g[newI][newk]
                }
              })
              // logic
              if (neighbors < 2 || neighbors > 3) {
                gridCopy[i][k] = 0
              } else if (g[i][k] === 0 && neighbors === 3) {
                gridCopy[i][k] = 1
              }
            }
          }
        })
      })
      setGeneration(g => g + 1)
      setTimeout(runSimulation, timeout);
    },
    [],
  )

  return (
    <>
      <h1>Conway's Game of Life</h1>
      <div className="divider"></div>
      <p className="description">The <strong>Game of Life</strong>, also known simply as <strong>Life</strong>, is a<a href={links.automaton} target="_blank" rel="noopener noreferrer"> cellular automaton</a> devised by the British mathematician <a href={links.author} target="_blank" rel="noopener noreferrer"> John Horton Conway</a> in 1970. It is a <a href={links.zeroPlayerGame} target="_blank" rel="noopener noreferrer">zero-player game</a>, meaning that its evolution is determined by its initial state, requiring no further input. One interacts with the Game of Life by creating an initial configuration and observing how it evolves. It is <a href={links.turingComplete} target="_blank" rel="noopener noreferrer">Turing complete</a> and can simulate a <a href={links.universalConstructor} target="_blank" rel="noopener noreferrer">universal constructor</a>or any other <a href={links.turingMachine} target="_blank" rel="noopener noreferrer">Turing machine</a>.</p>
      <div className="divider"></div>
      <h5>Rules</h5>
      <div className="row">
        <div className="col s12 l5">
          <div className="card blue-grey darken-1">
            <div className="card-content white-text">
              <p>
                The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, alive or dead, (or populated and unpopulated, respectively). Every cell interacts with its eight <a href={links.neighborhood}>neighbours</a>, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:
              </p>
            </div>
          </div>
        </div>
        <div className="col s12 l7">
          <ul className="collection left-align">
            <li className="collection-item">1.- Any live cell with fewer than two live neighbours dies, as if by underpopulation.</li>
            <li className="collection-item">2.- Any live cell with two or three live neighbours lives on to the next generation.</li>
            <li className="collection-item">3.- Any live cell with more than three live neighbours dies, as if by overpopulation.</li>
            <li className="collection-item">4.- Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
          </ul>
        </div>
      </div>
      <div className="divider"></div>
      <h5> Generation: {generation}</h5>
      <div className="row">
        <div className="col s12 l4">
          <div className="row">
            <button
              className="waves-effect waves-light btn"
              onClick={() => {
                setGrid(generateGrid({ isRandom: true }))
              }}>Random Generation</button>
          </div>
          <div className="row">
            <button
              className="waves-effect waves-light btn"
              onClick={() => {
                setRunning(!running)
                if (!running) {
                  runningRef.current = true
                  runSimulation()
                }
              }}>{running ? 'stop' : 'start'}
            </button>
          </div>
          <div className="row">
            <button
              className="waves-effect waves-light btn"
              onClick={() => {
                setGrid(generateGrid({ initValue: 0 }))
                setGeneration(0)
                setRunning(false)
                runningRef.current = false
              }}>Clear</button>
          </div>
        </div>
        <div className="row">
          <div className="col s12">
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${numCols}, ${cellSize}px)`
            }}>
              {grid.map((rows, i) =>
                rows.map((col, k) =>
                  <div
                    key={`${i}-${k}`}
                    onClick={() => {
                      const newGrid = produce(grid, gridCopy => {
                        gridCopy[i][k] = gridCopy[i][k] ? 0 : 1
                      })
                      setGrid(newGrid)
                    }}
                    className="cell"
                    style={{
                      // if is 0 would be undefined and 1 would be colored
                      backgroundColor: grid[i][k] ? 'lightcoral' : undefined,
                      height: cellSize,
                      width: cellSize
                    }}>
                  </div>))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
