import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import GameSelector from './GameSelector'

// Mock the CSS module
jest.mock('./GameSelector.module.css', () => ({
  gameSelector: 'gameSelector',
  gameButton: 'gameButton',
  active: 'active'
}))

describe('GameSelector', () => {
  test('renders without crashing', () => {
    render(<GameSelector />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  test('displays Blackjack text on button', () => {
    render(<GameSelector />)
    expect(screen.getByRole('button')).toHaveTextContent('Blackjack')
  })


  test('applies correct CSS classes', () => {
    const { container } = render(<GameSelector />)
    const button = screen.getByRole('button')

    // Get the div by className
    const selectorContainer = container.querySelector('.gameSelector')
    expect(selectorContainer).toHaveClass('gameSelector')
    expect(button).toHaveClass('gameButton', 'active')

  })

  test('button is enabled and clickable', () => {
    render(<GameSelector />)
    const button = screen.getByRole('button')
    expect(button).toBeEnabled()
  })

  test('renders single button', () => {
    render(<GameSelector />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(1)
  })
})