import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import GameContainer from './GameContainer'

// Mock the CSS modules
jest.mock('./GameSelector.module.css', () => ({
  gameSelector: 'gameSelector',
  gameButton: 'gameButton',
  active: 'active'
}))

jest.mock('./GameContainer.module.css', () => ({
  gameContainer: 'gameContainer',
  content: 'content',
  header: 'header',
  dark: 'dark',
  darkModeToggle: 'darkModeToggle'
}))

// Mock the child components
jest.mock('./GameSelector', () => 
  function GameSelector() {
    return <div data-testid="game-selector">Game Selector</div>
  }
)

jest.mock('./Blackjack', () => 
  function Blackjack() {
    return <div data-testid="blackjack-game">Blackjack Game</div>
  }
)

describe('GameContainer', () => {
  beforeEach(() => {
    // Clear document.body.classList before each test
    document.body.classList.remove('dark')
  })

  test('renders without crashing', () => {
    render(<GameContainer />)
    expect(screen.getByTestId('game-selector')).toBeInTheDocument()
    expect(screen.getByTestId('blackjack-game')).toBeInTheDocument()
  })

  test('starts in dark mode by default', () => {
    render(<GameContainer />)
    expect(document.body.classList.contains('dark')).toBe(true)
    expect(screen.getByText('☀️')).toBeInTheDocument()
  })

  test('toggles dark mode when clicking the button', () => {
    render(<GameContainer />)
    const toggleButton = screen.getByRole('button')

    // Initial state (dark mode)
    expect(document.body.classList.contains('dark')).toBe(true)
    expect(screen.getByText('☀️')).toBeInTheDocument()

    // Click to toggle to light mode
    fireEvent.click(toggleButton)
    expect(document.body.classList.contains('dark')).toBe(false)
    expect(screen.getByText('🌙')).toBeInTheDocument()

    // Click to toggle back to dark mode
    fireEvent.click(toggleButton)
    expect(document.body.classList.contains('dark')).toBe(true)
    expect(screen.getByText('☀️')).toBeInTheDocument()
  })

  test('applies dark mode class to container when in dark mode', () => {
    const { container } = render(<GameContainer />)
    const gameContainer = container.firstChild as HTMLElement
    expect(gameContainer.classList.contains('dark')).toBe(true)

    const toggleButton = screen.getByRole('button')
    fireEvent.click(toggleButton)
    expect(gameContainer.classList.contains('dark')).toBe(false)
  })

  test('maintains dark mode state across re-renders', () => {
    const { rerender } = render(<GameContainer />)
    const toggleButton = screen.getByRole('button')

    // Toggle to light mode
    fireEvent.click(toggleButton)
    expect(document.body.classList.contains('dark')).toBe(false)

    // Re-render the component
    rerender(<GameContainer />)
    expect(document.body.classList.contains('dark')).toBe(false)
  })
})