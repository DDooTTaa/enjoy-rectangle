import React from 'react'

interface Grid4x4Props {
  grid: boolean[][]
  onCellClick?: (row: number, col: number) => void
  isTarget?: boolean
  label?: string
  rotation?: number
  isFlippedHorizontal?: boolean
  isFlippedVertical?: boolean
}

export default function Grid4x4({ grid, onCellClick, isTarget = false, label, rotation = 0, isFlippedHorizontal = false, isFlippedVertical = false }: Grid4x4Props) {
  // CSS transform 순서: scale -> rotate (실제 적용 순서와 반대)
  const transformStyle = `scaleX(${isFlippedHorizontal ? -1 : 1}) scaleY(${isFlippedVertical ? -1 : 1}) rotate(${rotation}deg)`
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`grid grid-cols-4 gap-2 p-6 ${isTarget ? 'bg-green-50 border-2 border-green-200' : 'bg-white border border-gray-200'} rounded-xl shadow-lg transition-transform duration-300`}
        style={{ transform: transformStyle }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => onCellClick?.(rowIndex, colIndex)}
              className={`w-16 h-16 border border-gray-300 transition-colors ${
                cell ? 'bg-gray-600' : 'bg-white'
              } hover:bg-opacity-80`}
            />
          ))
        )}
      </div>
      {label && (
        <div className="text-center mt-2 text-sm font-medium text-gray-700">
          {label}
        </div>
      )}
    </div>
  )
}
