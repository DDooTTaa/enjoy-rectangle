// 4x4 그리드 유틸리티 함수들

export type Grid = boolean[][]

// 초기 그리드 생성 (모든 셀이 비어있음)
export const createInitialGrid = (): Grid => {
  return [
    [false, false, false, false],   // Row 1: 모두 비어있음
    [false, false, false, false],   // Row 2: 모두 비어있음
    [false, false, false, false],   // Row 3: 모두 비어있음
    [false, false, false, false],   // Row 4: 모두 비어있음
  ]
}

// 목표 그리드 생성 (X 패턴)
export const createTargetGrid = (): Grid => {
  return [
    [true, false, false, true],   // Row 1: Gray, White, White, Gray
    [false, true, true, false],   // Row 2: White, Gray, Gray, White
    [false, true, true, false],   // Row 3: White, Gray, Gray, White
    [true, false, false, true],   // Row 4: Gray, White, White, Gray
  ]
}

// 그리드 복사
export const copyGrid = (grid: Grid): Grid => {
  return grid.map(row => [...row])
}

// 그리드 비교
export const gridsEqual = (grid1: Grid, grid2: Grid): boolean => {
  for (let i = 0; i < grid1.length; i++) {
    for (let j = 0; j < grid1[i].length; j++) {
      if (grid1[i][j] !== grid2[i][j]) {
        return false
      }
    }
  }
  return true
}

// 왼쪽 45도 회전 (시계 반대 방향) - 실제로는 90도 회전
export const rotateLeft45 = (grid: Grid): Grid => {
  const newGrid = copyGrid(grid)
  const rotated = Array(4).fill(null).map(() => Array(4).fill(false))
  
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      // 90도 회전 (시계 반대 방향)
      rotated[3-j][i] = newGrid[i][j]
    }
  }
  
  return rotated
}

// 오른쪽 45도 회전 (시계 방향) - 실제로는 90도 회전
export const rotateRight45 = (grid: Grid): Grid => {
  const newGrid = copyGrid(grid)
  const rotated = Array(4).fill(null).map(() => Array(4).fill(false))
  
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      // 90도 회전 (시계 방향)
      rotated[j][3-i] = newGrid[i][j]
    }
  }
  
  return rotated
}

// 좌우 반전
export const flipHorizontal = (grid: Grid): Grid => {
  const newGrid = copyGrid(grid)
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 2; j++) {
      const temp = newGrid[i][j]
      newGrid[i][j] = newGrid[i][3-j]
      newGrid[i][3-j] = temp
    }
  }
  return newGrid
}

// 상하 반전
export const flipVertical = (grid: Grid): Grid => {
  const newGrid = copyGrid(grid)
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 4; j++) {
      const temp = newGrid[i][j]
      newGrid[i][j] = newGrid[3-i][j]
      newGrid[3-i][j] = temp
    }
  }
  return newGrid
}

// 최적해 찾기 (BFS 알고리즘)
export const findOptimalSolution = (initial: Grid, target: Grid): string[] => {
  const queue: { grid: Grid; moves: string[] }[] = [{ grid: copyGrid(initial), moves: [] }]
  const visited = new Set<string>()
  
  const gridToString = (grid: Grid): string => {
    return grid.map(row => row.map(cell => cell ? '1' : '0').join('')).join('')
  }
  
  const operations = [
    { name: '왼쪽 45° 회전', func: rotateLeft45 },
    { name: '오른쪽 45° 회전', func: rotateRight45 },
    { name: '좌우반전', func: flipHorizontal },
    { name: '상하반전', func: flipVertical }
  ]
  
  while (queue.length > 0) {
    const { grid, moves } = queue.shift()!
    const gridStr = gridToString(grid)
    
    if (visited.has(gridStr)) continue
    visited.add(gridStr)
    
    if (gridsEqual(grid, target)) {
      return moves
    }
    
    for (const op of operations) {
      const newGrid = op.func(grid)
      const newGridStr = gridToString(newGrid)
      
      if (!visited.has(newGridStr)) {
        queue.push({ grid: newGrid, moves: [...moves, op.name] })
      }
    }
  }
  
  return [] // 해결책을 찾지 못한 경우
}
