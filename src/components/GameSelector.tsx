import styles from "./GameSelector.module.css"

const GameSelector = () => {
  return (
    <div className={styles.gameSelector}>
      <button
        className={`${styles.gameButton} ${styles.active}`}>
        Blackjack
      </button>
    </div>
  )
}

export default GameSelector

