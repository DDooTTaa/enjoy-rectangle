'use client'

import React, { useState, useEffect } from 'react'
import Grid4x4 from '@/components/Grid4x4'
import { 
  createInitialGrid, 
  createTargetGrid, 
  rotateLeft45, 
  rotateRight45, 
  flipHorizontal, 
  flipVertical,
  findOptimalSolution,
  copyGrid,
  type Grid
} from '@/utils/puzzleUtils'

export default function PuzzlePage() {
  const [currentGrid, setCurrentGrid] = useState<Grid>(createInitialGrid())
  const [targetGrid] = useState<Grid>(createTargetGrid())
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [remainingMoves, setRemainingMoves] = useState(999)
  const [isSolved, setIsSolved] = useState(false)
  const [optimalSolution, setOptimalSolution] = useState<string[]>([])
  const [showHint, setShowHint] = useState(false)
  const [currentRotation, setCurrentRotation] = useState(0)
  const [isFlippedHorizontal, setIsFlippedHorizontal] = useState(false)
  const [isFlippedVertical, setIsFlippedVertical] = useState(false)

  // 최적해 찾기
  useEffect(() => {
    const solution = findOptimalSolution(createInitialGrid(), targetGrid)
    setOptimalSolution(solution)
  }, [targetGrid])

  // 해결 상태 확인 (회전 및 반전 고려)
  useEffect(() => {
    // CSS transform 순서에 맞춰서 목표 그리드 변환
    // CSS: scaleX -> scaleY -> rotate
    // 데이터: 반전 -> 회전 순서로 적용
    let targetToCompare = copyGrid(targetGrid)
    
    // 1. 먼저 반전 적용
    if (isFlippedHorizontal) {
      targetToCompare = flipHorizontal(targetToCompare)
    }
    if (isFlippedVertical) {
      targetToCompare = flipVertical(targetToCompare)
    }
    
    // 2. 그 다음 회전 적용
    const currentAngle = ((currentRotation % 360) + 360) % 360
    targetToCompare = rotateGridToAngle(targetToCompare, currentAngle)
    
    const solved = JSON.stringify(currentGrid) === JSON.stringify(targetToCompare)
    setIsSolved(solved)
  }, [currentGrid, targetGrid, currentRotation, isFlippedHorizontal, isFlippedVertical])

  const applyOperation = (operation: string, operationFunc: (grid: Grid) => Grid) => {
    if (remainingMoves <= 0 || isSolved) return
    
    // 모든 동작은 시각적 효과만 (데이터는 변경하지 않음)
    if (operation === '왼쪽 45° 회전') {
      // 반전 상태에 따라 회전 방향 조정
      if (isFlippedHorizontal && isFlippedVertical) {
        // 둘 다 반전된 경우: 회전 방향 유지
        setCurrentRotation(prev => prev - 45)
      } else if (isFlippedHorizontal || isFlippedVertical) {
        // 하나만 반전된 경우: 회전 방향 반대
        setCurrentRotation(prev => prev + 45)
      } else {
        // 반전 없는 경우: 정상 회전
        setCurrentRotation(prev => prev - 45)
      }
    } else if (operation === '오른쪽 45° 회전') {
      // 반전 상태에 따라 회전 방향 조정
      if (isFlippedHorizontal && isFlippedVertical) {
        // 둘 다 반전된 경우: 회전 방향 유지
        setCurrentRotation(prev => prev + 45)
      } else if (isFlippedHorizontal || isFlippedVertical) {
        // 하나만 반전된 경우: 회전 방향 반대
        setCurrentRotation(prev => prev - 45)
      } else {
        // 반전 없는 경우: 정상 회전
        setCurrentRotation(prev => prev + 45)
      }
    } else if (operation === '좌우반전') {
      setIsFlippedHorizontal(prev => !prev)
    } else if (operation === '상하반전') {
      setIsFlippedVertical(prev => !prev)
    }
    
    setMoveHistory([...moveHistory, operation])
    setRemainingMoves(remainingMoves - 1)
  }

  const undoLastMove = () => {
    if (moveHistory.length === 0) return
    
    const lastMove = moveHistory[moveHistory.length - 1]
    const newHistory = moveHistory.slice(0, -1)
    
    // 마지막 동작을 반대로 실행
    let reversedGrid = currentGrid
    if (lastMove.startsWith('셀')) {
      // 셀 토글의 경우 다시 토글
      const match = lastMove.match(/셀 \((\d+),(\d+)\) 토글/)
      if (match) {
        const row = parseInt(match[1]) - 1
        const col = parseInt(match[2]) - 1
        reversedGrid = currentGrid.map((gridRow, rowIndex) =>
          gridRow.map((cell, colIndex) => {
            if (rowIndex === row && colIndex === col) {
              return !cell
            }
            return cell
          })
        )
      }
    } else {
      switch (lastMove) {
        case '왼쪽 45° 회전':
          // 반전 상태에 따라 회전 방향 조정 (되돌리기)
          if (isFlippedHorizontal && isFlippedVertical) {
            setCurrentRotation(prev => prev + 45)
          } else if (isFlippedHorizontal || isFlippedVertical) {
            setCurrentRotation(prev => prev - 45)
          } else {
            setCurrentRotation(prev => prev + 45)
          }
          break
        case '오른쪽 45° 회전':
          // 반전 상태에 따라 회전 방향 조정 (되돌리기)
          if (isFlippedHorizontal && isFlippedVertical) {
            setCurrentRotation(prev => prev - 45)
          } else if (isFlippedHorizontal || isFlippedVertical) {
            setCurrentRotation(prev => prev + 45)
          } else {
            setCurrentRotation(prev => prev - 45)
          }
          break
        case '좌우반전':
          setIsFlippedHorizontal(prev => !prev)
          break
        case '상하반전':
          setIsFlippedVertical(prev => !prev)
          break
      }
    }
    
    setCurrentGrid(reversedGrid)
    setMoveHistory(newHistory)
    setRemainingMoves(remainingMoves + 1)
  }

  const resetPuzzle = () => {
    setCurrentGrid(createInitialGrid())
    setMoveHistory([])
    setRemainingMoves(999)
    setIsSolved(false)
    setCurrentRotation(0)
    setIsFlippedHorizontal(false)
    setIsFlippedVertical(false)
  }

  const toggleHint = () => {
    setShowHint(!showHint)
  }

  // 특정 각도로 그리드를 회전시키는 함수
  const rotateGridToAngle = (grid: Grid, angle: number): Grid => {
    let rotated = copyGrid(grid)
    
    for (let i = 0; i < angle / 90; i++) {
      rotated = rotateRight45(rotated)
    }
    
    return rotated
  }

  const toggleCell = (row: number, col: number) => {
    if (isSolved || remainingMoves <= 0) return
    
    const newGrid = currentGrid.map((gridRow, rowIndex) =>
      gridRow.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return !cell // 토글
        }
        return cell
      })
    )
    setCurrentGrid(newGrid)
    setRemainingMoves(remainingMoves - 1)
    setMoveHistory([...moveHistory, `셀 (${row+1},${col+1}) 토글`])
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            4x4 회전 퍼즐
          </h1>
          <p className="text-gray-600">
            빈 그리드에 색을 칠하고 뒤집고 회전해 보세요!
          </p>
          <p className="text-sm text-gray-500 mt-2">
            💡 팁: 그리드의 셀을 클릭하면 색을 칠하거나 지울 수 있습니다
          </p>
          <div className="mt-4 flex justify-center items-center space-x-4">
            <div className="text-lg font-semibold text-blue-600">
              남은 클릭 횟수: {remainingMoves}
            </div>
            {isSolved && (
              <div className="text-lg font-bold text-green-600">
                🎉 완료!
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 퍼즐 영역 */}
          <div className="space-y-6">
            <div className="flex justify-center items-center space-x-8">
              <Grid4x4 
                grid={currentGrid}
                label=""
                rotation={currentRotation}
                isFlippedHorizontal={isFlippedHorizontal}
                isFlippedVertical={isFlippedVertical}
                onCellClick={toggleCell}
              />
            </div>
          </div>

          {/* 조작 패널 */}
          <div className="space-y-6">
            {/* 동작 버튼들 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                동작 선택
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => applyOperation('왼쪽 45° 회전', rotateLeft45)}
                  disabled={remainingMoves <= 0 || isSolved}
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-black"
                >
                  <div className="text-2xl mb-2 text-black">↺</div>
                  <span className="text-sm font-medium text-black">왼쪽 45° 회전</span>
                </button>
                
                <button
                  onClick={() => applyOperation('오른쪽 45° 회전', rotateRight45)}
                  disabled={remainingMoves <= 0 || isSolved}
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-black"
                >
                  <div className="text-2xl mb-2 text-black">↻</div>
                  <span className="text-sm font-medium text-black">오른쪽 45° 회전</span>
                </button>
                
                <button
                  onClick={() => applyOperation('좌우반전', flipHorizontal)}
                  disabled={remainingMoves <= 0 || isSolved}
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-black"
                >
                  <div className="text-2xl mb-2 text-black">↔</div>
                  <span className="text-sm font-medium text-black">좌우반전</span>
                </button>
                
                <button
                  onClick={() => applyOperation('상하반전', flipVertical)}
                  disabled={remainingMoves <= 0 || isSolved}
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-black"
                >
                  <div className="text-2xl mb-2 text-black">↕</div>
                  <span className="text-sm font-medium text-black">상하반전</span>
                </button>
              </div>
            </div>

            {/* 힌트 및 제어 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                힌트 & 제어
              </h3>
              
              <div className="space-y-4">
                
                {showHint && optimalSolution.length > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800 mb-2">
                      최적해 ({optimalSolution.length}단계):
                    </p>
                    <p className="text-sm text-yellow-700">
                      {optimalSolution.join(' → ')}
                    </p>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <button
                    onClick={undoLastMove}
                    disabled={moveHistory.length === 0}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    하나 지움
                  </button>
                  
                  <button
                    onClick={resetPuzzle}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    전체 초기화
                  </button>
                </div>
              </div>
            </div>

            {/* 이동 기록 */}
            {moveHistory.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  이동 기록
                </h3>
                <div className="flex flex-wrap gap-2">
                  {moveHistory.map((move, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded"
                    >
                      {index + 1}. {move}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 완료 메시지 */}
        {isSolved && (
          <div className="mt-8 text-center">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              <p className="font-semibold">축하합니다! 퍼즐을 완료했습니다! 🎉</p>
              <p className="text-sm mt-1">
                사용한 단계: {moveHistory.length} / 최적해: {optimalSolution.length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
