import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { useState,useEffect } from 'react';

let Square = ({ value, onSquareClick }) => {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

let Board = ({ xIsNext, squares, onPlay, jumpTo }) => {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {

      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Ganador: ' + winner;
    Swal.fire({
      title: `🎉 ¡Felicidades, ${winner}! 🎉`,
      text: "Has sido seleccionado como el ganador.",
      icon: "success",
      confirmButtonText: "Aceptar"
    });
  } else {
    status = 'Siguiente jugador: ' + (xIsNext ? 'X' : 'O');
  }
  const resetGame = ()=>{
    jumpTo(0);
  }
  return (
    <>
      <div className="status"><span className="badge rounded-pill text-bg-light">{status}</span></div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
      <Button title={'Reiniciar'} resetGame={resetGame} className={'btn btn-outline-success m-2 btn-sm bordered-0'} icon={"bi bi-arrow-clockwise"} />
    </>
  );
}

let Game = () => {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [activeMov, setActiveMov] = useState('');
  const [mode, setMode] = useState("unicoj"); // Estado para el modo de juego
  const [isAITurn, setIsAITurn] = useState(false);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    if (mode === "unicoj") {
      setIsAITurn(true);
    }
  }

  useEffect(() => {
    if (isAITurn) {
      setTimeout(() => {
        handleAIPlay(history[currentMove]);
        setIsAITurn(false);  //turno jugador
      }, 500);
    }
  }, [isAITurn, currentMove, history]);

  function handleAIPlay(squares) {
    console.log(squares);
  
    const emptySquares = squares
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);
  
    if (emptySquares.length === 0) return;
  
    const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    const nextSquares = squares.slice();
    nextSquares[randomIndex] = 'O';
  
    handlePlay(nextSquares);
  }

  function jumpTo(nextMove) {
    console.log(nextMove)
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Ir al movimiento #' + move;
    } else {
      description = 'Ir al inicio del juego';
    }
    return (
      <li key={move} className='list-group list-group-flush' style={{ fontSize: "font-size: 14px" }}>
        <button className='list-group-item list-group-item-action text-center' onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="row">
      <div className="col-sm-12 col-md-6 d-flex justify-content-start flex-column align-items-center">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} jumpTo={jumpTo} />
      </div>
      <div className="col-sm-12 col-md-6">
        <RadioButtons setMode={setMode} mode={mode} />
        <ol className='p-0 my-2'>{moves}</ol>
      </div>
    </div>
  );
}

const Button = ({ title, className, icon, resetGame }) => {
  return (
    <>
      <button className={className} onClick={resetGame} style={{border: 'none'}}><i className={icon}></i> {title}</button>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      console.log(squares[a]);
      return squares[a];
    }
  }
  return null;
}

let HeaderPage = () => {
  return (
    <>
      <nav className="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
        <div className="container">
          <a className="navbar-brand" target='_blank' title='Descargar código fuente' href="https://github.com/josedev99/juego-tres-en-linea"><i className="bi bi-github"></i></a>
        </div>
      </nav>
    </>
  );
}

function RadioButtons({ setMode, mode }) {
  return (
    <div>
      <div className="radio icheck-turquoise d-inline mx-2">
        <input type="radio" id="unicoj" name="optionJugador" value="unicoj" checked={mode === "unicoj"} onChange={() => setMode("unicoj")} />
        <label htmlFor="unicoj">Un jugador</label>
      </div>
      <div className="radio icheck-turquoise d-inline">
        <input type="radio" id="multij" name="optionJugador" value="multij" checked={mode === "multij"} onChange={() => setMode("multij")} />
        <label htmlFor="multij">Multijugador</label>
      </div>
    </div>
  );
}

let Card = ({ title, children }) => {
  return (
    <>
      <div className="card col-sm-12 col-md-6">
        <div className="card-header p-1 text-center">
          <h4>{title}</h4>
        </div>
        <div className="card-body p-1">
          {children}
        </div>
      </div>
    </>
  );
}

let App = () => {
  return (
    <div>
      <HeaderPage />
      <main className='container p-3 d-flex justify-content-center'>
        <Card title={"Juego de tres en linea"} children={<Game />} />
      </main>
    </div>
  );
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);