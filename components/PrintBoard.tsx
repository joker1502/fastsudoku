interface PrintBoardProps {
  puzzle: number[];
  solution: number[];
  answer?: boolean;
  label?: string;
}

export default function PrintBoard({
  puzzle,
  solution,
  answer = false,
  label,
}: PrintBoardProps) {
  return (
    <figure
      className={`print-board ${answer ? 'board-answer' : 'board-puzzle'}`}
    >
      {label ? <figcaption className="board-label">{label}</figcaption> : null}
      <div className="pboard" role="img" aria-label={label ?? 'Sudoku grid'}>
        {Array.from({ length: 81 }, (_, index) => {
          const row = Math.floor(index / 9);
          const col = index % 9;
          const classes = ['pcell'];
          if (col === 2 || col === 5) {
            classes.push('br');
          }
          if (row === 2 || row === 5) {
            classes.push('bb');
          }
          return (
            <span key={index} className={classes.join(' ')}>
              <span className="pval">
                {puzzle[index] !== 0 ? puzzle[index] : ''}
              </span>
              <span className="aval">{solution[index]}</span>
            </span>
          );
        })}
      </div>
    </figure>
  );
}
