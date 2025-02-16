import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  createBlackjackDeck,
  shuffleDeck,
  drawCard,
  checkForDuplicates,
} from './deck';

describe('Deck Utilities', () => {
  describe('createBlackjackDeck', () => {
    test('creates a deck with 312 cards (6 decks)', () => {
      const deck = createBlackjackDeck();
      expect(deck.length).toBe(312);
    });

    test('contains exactly 6 of each card combination', () => {
      const deck = createBlackjackDeck();
      const cardCounts = new Map<string, number>();
      
      deck.forEach(card => {
        const key = `${card.suit}-${card.value}`;
        cardCounts.set(key, (cardCounts.get(key) || 0) + 1);
      });

      cardCounts.forEach((count) => {
        expect(count).toBe(6);
      });
    });
  });
  describe('shuffleDeck', () => {
    test('returns a deck with the same length', () => {
      const originalDeck = createBlackjackDeck();
      const shuffledDeck = shuffleDeck(originalDeck);
      expect(shuffledDeck.length).toBe(originalDeck.length);
    });

    test('contains all the same cards as the original deck', () => {
      const originalDeck = createBlackjackDeck();
      const shuffledDeck = shuffleDeck(originalDeck);
      
      const originalCards = new Set(originalDeck.map(card => `${card.suit}-${card.value}`));
      const shuffledCards = new Set(shuffledDeck.map(card => `${card.suit}-${card.value}`));
      
      expect(shuffledCards).toEqual(originalCards);
    });

    test('randomizes the order of cards', () => {
      // Mock Math.random for consistent testing
      const mockRandom = jest.spyOn(global.Math, 'random');
      mockRandom.mockReturnValue(0.5);

      const originalDeck = createBlackjackDeck();
      const shuffledDeck = shuffleDeck([...originalDeck]);
      
      let hasChanged = false;
      for (let i = 0; i < originalDeck.length; i++) {
        if (
          originalDeck[i].suit !== shuffledDeck[i].suit || 
          originalDeck[i].value !== shuffledDeck[i].value
        ) {
          hasChanged = true;
          break;
        }
      }
      
      expect(hasChanged).toBe(true);
      mockRandom.mockRestore();
    });
  });
  describe('drawCard', () => {
    test('returns a tuple with drawn card and remaining deck', () => {
      const deck = createBlackjackDeck();
      const [drawnCard, remainingDeck] = drawCard(deck);
      
      expect(drawnCard).toBeDefined();
      expect(remainingDeck.length).toBe(deck.length - 1);
    });

    test('removes the drawn card from the deck', () => {
      const deck = createBlackjackDeck();
      const [drawnCard, remainingDeck] = drawCard(deck);

      // Create a unique identifier for the drawn card (e.g., "hearts-A")
      const drawnCardKey = `${drawnCard.suit}-${drawnCard.value}`;
 
      // Since we're using 6 decks, the card might still exist in remaining deck
      // We just check that at least one instance was removed
      // Count how many of this card were in the original deck
      const originalCount = deck.filter(
        card => `${card.suit}-${card.value}` === drawnCardKey
      ).length;
      
      const remainingCount = remainingDeck.filter(
        card => `${card.suit}-${card.value}` === drawnCardKey
      ).length;
      
      expect(remainingCount).toBe(originalCount - 1);
    });
  });
  describe('checkForDuplicates', () => {
    test('returns true for a blackjack deck (6 decks)', () => {
      const deck = createBlackjackDeck();
      expect(checkForDuplicates(deck)).toBe(true);
    });

    interface CardProps {
        suit: "hearts" | "diamonds" | "clubs" | "spades";
        value: "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";
    }
    test('returns false for a deck with no duplicates', () => {
        const singleDeck: CardProps[] = [
          { suit: "hearts", value: "A" },
          { suit: "diamonds", value: "K" },
          { suit: "clubs", value: "Q" },
          { suit: "spades", value: "J" }
        ];
        expect(checkForDuplicates(singleDeck)).toBe(false);
    });

    test('handles empty deck', () => {
      expect(checkForDuplicates([])).toBe(false);
    });

    test('detects duplicate cards', () => {
      const deckWithDuplicate: CardProps[] = [
        { suit: 'hearts', value: 'A' },
        { suit: 'diamonds', value: 'K' },
        { suit: 'hearts', value: 'A' }  // Duplicate
      ];
      expect(checkForDuplicates(deckWithDuplicate)).toBe(true);
    });
  });
});