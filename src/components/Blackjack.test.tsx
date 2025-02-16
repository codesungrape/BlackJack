import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Blackjack from "./Blackjack";
import * as deckUtils from "@/lib/utils/deck";


jest.mock("@/lib/utils/deck");

describe("Blackjack Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(deckUtils, "createBlackjackDeck").mockReturnValue([]);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Game Initialization", () => {
    test("renders initial game state correctly", () => {
      render(<Blackjack />);
      expect(screen.getByText("BLACKJACK")).toBeInTheDocument();
      expect(screen.getByText("Dealer's Hand")).toBeInTheDocument();
      expect(screen.getByText("Player's Hand(0)")).toBeInTheDocument();
      expect(screen.getByText(/BALANCE:\s*£\s*1000/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter bet amount")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Place Bet" })
      ).toBeInTheDocument();
    });
  });

  describe("Betting Logic", () => {
    test("handles invalid bet scenarios", () => {
      render(<Blackjack />);
      const scenarios = [
        { value: "-50", message: "Invalid bet amount" },
        { value: "0", message: "Invalid bet amount" },
        { value: "2000", message: "Invalid bet amount" },
        { value: "abc", message: "Invalid bet amount" }
      ];

      scenarios.forEach(({ value, message }) => {
        const betInput = screen.getByPlaceholderText("Enter bet amount");
        fireEvent.change(betInput, { target: { value } });
        fireEvent.click(screen.getByRole("button", { name: "Place Bet" }));
        expect(screen.getByText(new RegExp(message))).toBeInTheDocument();
      });
    });
  });

  describe("Game Play", () => {

    interface Card {
      suit: "spades" | "hearts" | "diamonds" | "clubs";
      value: "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";
    }
    test("handles player bust scenario", () => {
      // Setup mock deck with cards that will cause a bust
      const mockDeck: Card[] = [
        { suit: "spades", value: "10" },  // First two cards dealt to player
        { suit: "hearts", value: "8" },   // First card to dealer
        { suit: "diamonds", value: "6" },  // Second card to player
        { suit: "clubs", value: "4" },    // Second card to dealer
        { suit: "hearts", value: "K" }    // Hit card that will cause bust
      ];
      
      jest.spyOn(deckUtils, "createBlackjackDeck").mockReturnValue([...mockDeck]);
      
      let currentDeck = [...mockDeck];
      jest.spyOn(deckUtils, "drawCard").mockImplementation(() => {
        const card = currentDeck[0];
        currentDeck = currentDeck.slice(1);
        return [card, currentDeck];
      });
    
      render(<Blackjack />);
    
      // Place bet
      const betInput = screen.getByPlaceholderText("Enter bet amount");
      fireEvent.change(betInput, { target: { value: "100" } });
      fireEvent.click(screen.getByRole("button", { name: "Place Bet" }));
    
      // Hit should cause a bust (10 + 6 + K = 26)
      fireEvent.click(screen.getByRole("button", { name: "Hit" }));
    
      // Verify bust state
      expect(screen.getByText("Bust! You lose.")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Play Again" })).toBeInTheDocument();
    });

    test("handles dealer play sequence", async () => {
      jest.spyOn(deckUtils, "drawCard")
        .mockReturnValueOnce([{ suit: "spades", value: "10" }, []])  // Player card 1
        .mockReturnValueOnce([{ suit: "hearts", value: "8" }, []])   // Dealer card 1
        .mockReturnValueOnce([{ suit: "diamonds", value: "6" }, []]) // Player card 2
        .mockReturnValueOnce([{ suit: "clubs", value: "9" }, []])    // Dealer card 2
        .mockReturnValueOnce([{ suit: "hearts", value: "2" }, []])   // Dealer hit card

      render(<Blackjack />);
      
      // Place bet and stand
      const betInput = screen.getByPlaceholderText("Enter bet amount");
      fireEvent.change(betInput, { target: { value: "100" } });
      fireEvent.click(screen.getByRole("button", { name: "Place Bet" }));
      fireEvent.click(screen.getByRole("button", { name: "Stand" }));

      // Fast-forward dealer play timer
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.getByText(/Dealer wins!/i)).toBeInTheDocument();
    });

    // test("handles ace value calculations correctly", () => {
    //   jest.spyOn(deckUtils, "drawCard")
    //     .mockReturnValueOnce([{ suit: "spades", value: "A" }, []])  // Player card 1: Ace
    //     .mockReturnValueOnce([{ suit: "hearts", value: "2" }, []])  // Dealer card 1
    //     .mockReturnValueOnce([{ suit: "diamonds", value: "K" }, []]) // Player card 2: King
    //     .mockReturnValueOnce([{ suit: "clubs", value: "5" }, []]); // Dealer card 2
    
    //   render(<Blackjack />);
      
    //   const betInput = screen.getByPlaceholderText("Enter bet amount");
    //   fireEvent.change(betInput, { target: { value: "100" } });
    //   fireEvent.click(screen.getByRole("button", { name: "Place Bet" }));
    
    //   // Debug logs
    //   screen.debug(); // This will show the full DOM
    //   console.log('Player hand:', screen.getByText(/Player's Hand/i).textContent);
    
    //   expect(screen.getByText(/Player's Hand\(21\)/)).toBeInTheDocument();
    // });
  });
  test("places valid bet and starts game", () => {
    jest
      .spyOn(deckUtils, "drawCard")
      .mockReturnValueOnce([{ suit: "spades", value: "10" }, []])
      .mockReturnValueOnce([{ suit: "hearts", value: "8" }, []])
      .mockReturnValueOnce([{ suit: "diamonds", value: "6" }, []])
      .mockReturnValueOnce([{ suit: "clubs", value: "4" }, []]);

    render(<Blackjack />);

    const betInput = screen.getByPlaceholderText("Enter bet amount");
    const placeBetButton = screen.getByRole("button", { name: "Place Bet" });

    fireEvent.change(betInput, { target: { value: "100" } });
    fireEvent.click(placeBetButton);

    expect(screen.getByText("Your turn: Hit or Stand?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Stand" })).toBeInTheDocument();
    expect(screen.getByText("CURRENT BET: £100")).toBeInTheDocument();
    expect(screen.getByText("BALANCE: £900")).toBeInTheDocument();
  });

  test("handles player actions - hit", () => {
    jest
      .spyOn(deckUtils, "drawCard")
      .mockReturnValueOnce([{ suit: "spades", value: "10" }, []])
      .mockReturnValueOnce([{ suit: "hearts", value: "8" }, []])
      .mockReturnValueOnce([{ suit: "diamonds", value: "6" }, []])
      .mockReturnValueOnce([{ suit: "clubs", value: "4" }, []])
      .mockReturnValueOnce([{ suit: "hearts", value: "3" }, []]);

    render(<Blackjack />);

    const betInput = screen.getByPlaceholderText("Enter bet amount");
    fireEvent.change(betInput, { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "Place Bet" }));

    const hitButton = screen.getByRole("button", { name: "Hit" });
    fireEvent.click(hitButton);

    expect(screen.getByText("Your turn: Hit or Stand?")).toBeInTheDocument();
  });

  test("handles player actions - stand", () => {
    jest
      .spyOn(deckUtils, "drawCard")
      .mockReturnValueOnce([{ suit: "spades", value: "10" }, []])
      .mockReturnValueOnce([{ suit: "hearts", value: "8" }, []])
      .mockReturnValueOnce([{ suit: "diamonds", value: "6" }, []])
      .mockReturnValueOnce([{ suit: "clubs", value: "4" }, []]);

    render(<Blackjack />);

    const betInput = screen.getByPlaceholderText("Enter bet amount");
    fireEvent.change(betInput, { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "Place Bet" }));

    const standButton = screen.getByRole("button", { name: "Stand" });
    fireEvent.click(standButton);

    expect(screen.getByText("Dealer's turn...")).toBeInTheDocument();
  });
});
