'use client';

interface SolverBoardProps {
  values: number[];
  given?: boolean[];
  selected?: number | null;
  highlightIndex?: number | null;
  peerIndexes?: number[];
  readOnly?: boolean;
  onCellClick?: (index: number) => void;
}

function cellClass(
  index: number,
  given: boolean,
  selected: boolean,
  highlight: boolean,
  peer: boolean,
): string {
  const row = Math.floor(index / 9);
  const col = index % 9;
  const classes = ['cell'];
  if (col === 2 || col === 5) {
    classes.push('br');
  }
  if (row === 2 || row === 5) {
    classes.push('bb');
  }
  if (selected) {
    classes.push('selected');
  } else if (highlight) {
    classes.push('step-active');
  } else if (peer) {
    classes.push('peer');
  }
  return classes.join(' ');
}

export default function SolverBoard({
  values,
  given = [],
  selected = -1,
  highlightIndex = null,
  peerIndexes = [],
  readOnly = false,
  onCellClick,
}: SolverBoardProps) {
  const peerSet = new Set(peerIndexes);
  return (
    <div className="board" aria-label="Sudoku board">
      {values.map((value, index) => {
        const isGiven = given[index] === true;
        return (
          <button
            key={index}
            className={cellClass(
              index,
              isGiven,
              index === selected,
              index === highlightIndex,
              peerSet.has(index),
            )}
            onClick={readOnly ? undefined : () => onCellClick?.(index)}
            tabIndex={readOnly ? -1 : 0}
            aria-label={
              `Cell row ${Math.floor(index / 9) + 1} column ${(index % 9) + 1}` +
              (value !== 0 ? `, value ${value}` : '')
            }
          >
            {value !== 0 ? (
              <span className={isGiven ? 'given-value' : 'entered'}>
                {value}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
