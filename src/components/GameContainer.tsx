"use client"

import { useState, useEffect } from "react"
import Blackjack from "./Blackjack"
import GameSelector from "./GameSelector"
import styles from "./GameContainer.module.css"

const GameContainer = () => {
  const [currentGame, setCurrentGame] = useState<"blackjack" | "gofish">("blackjack")
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  return (
    <div className={`${styles.gameContainer} ${isDarkMode ? styles.dark : ""}`}>
      <div className={styles.content}>
        <div className={styles.header}>
          <GameSelector/>
          <button className={styles.darkModeToggle} onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>
        <Blackjack />
      </div>
    </div>
  )
}

export default GameContainer

