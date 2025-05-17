import { useState } from 'react';
import './App.css';

const winningCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function App() {
  const [players, setPlayers] = useState([
    { name: '', image: '', mark: 'X' },
    { name: '', image: '', mark: 'O' }
  ]);
  const [groups, setGroups] = useState([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [current, setCurrent] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [winners, setWinners] = useState([]); // Track winners of each group

  const winner = getWinner(board);

  function getWinner(squares) {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  function handleClick(i) {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = groups[currentGroupIndex][current].mark;
    setBoard(newBoard);
    setCurrent((current + 1) % groups[currentGroupIndex].length);
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setCurrent(0);
  }

  function startGame(e) {
    e.preventDefault();
    if (players.some(p => p.name.trim() === '')) {
      alert('All players must have names.');
      return;
    }

    const newGroups = [];
    const remainingPlayers = [...players];

    // Group players into pairs
    while (remainingPlayers.length > 1) {
      newGroups.push(remainingPlayers.splice(0, 2));
    }

    // If there's an odd player left, add them to the winners list for the next round
    if (remainingPlayers.length === 1) {
      setWinners([remainingPlayers[0]]);
    }

    setGroups(newGroups);
    setIsStarted(true);
  }

  function updatePlayer(index, field, value) {
    const newPlayers = [...players];
    newPlayers[index][field] = value;
    setPlayers(newPlayers);
  }

  function addPlayer() {
    const marks = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const usedMarks = players.map(p => p.mark);
    const nextMark = marks.split('').find(c => !usedMarks.includes(c));
    setPlayers([...players, { name: '', image: '', mark: nextMark || '?' }]);
  }

  const currentGroup = groups[currentGroupIndex];
  const currentPlayer = currentGroup ? currentGroup[current] : null;
  const winnerPlayer = currentGroup ? currentGroup.find(p => p.mark === winner) : null;

  function nextGroup() {
    if (winnerPlayer) {
      setWinners([...winners, winnerPlayer]); // Add the winner to the winners list
    }

    if (currentGroupIndex < groups.length - 1) {
      setCurrentGroupIndex(currentGroupIndex + 1);
      resetGame();
    } else if (winners.length > 1) {
      // Start a new round with the winners
      setGroups([]);
      setCurrentGroupIndex(0);
      setGroups(winners.map((winner, i) => winners.slice(i, i + 2)));
      setWinners([]);
      resetGame();
    } else {
      alert(`🎉 ${winners[0].name} is the ultimate winner! 🎉`);
    }
  }

  return (
    <div className="App">
      {!isStarted ? (
        <form className="start-form" onSubmit={startGame}>
          <h2>Enter Player Info</h2>
          {players.map((player, i) => (
            <div key={i}>
              <input
                required
                type="text"
                placeholder={`Player ${i + 1} Name`}
                onChange={e => updatePlayer(i, 'name', e.target.value)}
              />
              <input
                type="text"
                placeholder="Image URL (optional)"
                onChange={e => updatePlayer(i, 'image', e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={addPlayer}>+ Add Player</button>
          <button type="submit">Start Game</button>
        </form>
      ) : (
        <>
          <h1>Tic Tac Toe</h1>
          <div className="players">
            {currentGroup.map((player, i) => (
              <div key={i} className="player">
                <img
                  src={player.image || 'i.pravatar.cc/150?img=8'}
                  alt={`Player ${i + 1}`}
                />
                <p>{player.mark}: {player.name}</p>
              </div>
            ))}
          </div>
          <div className="board">
            {board.map((val, idx) => (
              <button
                key={idx}
                className={`square ${val}`}
                onClick={() => handleClick(idx)}
              >
                {val}
              </button>
            ))}
          </div>
          {winner ? (
            <div className="winner">
              🎉 {winnerPlayer.name} Wins! 🎉
            </div>
          ) : (
            <h2>Next: {currentPlayer.name}</h2>
          )}
          <button onClick={resetGame}>Restart</button>
          {currentGroupIndex < groups.length - 1 || winners.length > 1 ? (
            <button onClick={nextGroup}>Next Group</button>
          ) : (
            <h2>🎉 {winners[0].name} is the ultimate winner! 🎉</h2>
          )}
        </>
      )}
    </div>
  );
}

export default App;