import styles from "./App.module.css";
import { useEffect, useState } from "react";

function App() {
  console.log("renderizou");
  const tamanho = 20;
  const [cobra, setCobra] = useState([[0, 0]]);
  const [gameOver, setGameOver] = useState(false);
  const [direcao, setDirecao] = useState("right");
  const [comida, setComida] = useState([10, 10]);
  const [score, setScore] = useState(0);
  const [jogar, setJogar] = useState(false);

  useEffect(() => {
    if (gameOver) {
      alert("Game Over");
    } else {
      const intervalo = setInterval(() => {
        moverCobra();
      }, 100);
      return () => clearInterval(intervalo);
    }
  }, [cobra]);

  function moverCobra() {
    setCobra((prevCobra) => {
      let comeu = false;
      const novaCabeca = [...prevCobra[0]];
      const corpo = prevCobra.slice(1);

      switch (direcao) {
        case "right":
          novaCabeca[1] += 1;
          break;
        case "left":
          novaCabeca[1] -= 1;
          break;
        case "up":
          novaCabeca[0] -= 1;
          break;
        case "down":
          novaCabeca[0] += 1;
          break;
        default:
          break;
      }

      if (
        novaCabeca[0] < 0 ||
        novaCabeca[0] >= tamanho ||
        novaCabeca[1] < 0 ||
        novaCabeca[1] >= tamanho ||
        corpo.some(
          (segmento) =>
            segmento[0] === novaCabeca[0] && segmento[1] === novaCabeca[1]
        )
      ) {
        setScore(0);
        setGameOver(true);
      }
      if (novaCabeca[0] === comida[0] && novaCabeca[1] === comida[1]) {
        comeu = true;
        setScore(score + 1);
        setComida([
          Math.floor(Math.random() * tamanho),
          Math.floor(Math.random() * tamanho),
        ]);
      }

      if (comeu) {
        console.log("comeu");
        const novaCobra = [novaCabeca, ...prevCobra];
        return novaCobra;
      } else {
        const novaCobra = [
          novaCabeca,
          ...prevCobra.slice(0, prevCobra.length - 1),
        ];
        return novaCobra;
      }
    });
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowRight":
          if (direcao !== "left") setDirecao("right");
          break;
        case "ArrowLeft":
          if (direcao !== "right") setDirecao("left");
          break;
        case "ArrowUp":
          if (direcao !== "down") setDirecao("up");
          break;
        case "ArrowDown":
          if (direcao !== "up") setDirecao("down");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <>
      <header>
        <h1 className={styles.title}>Snake Game</h1>
      </header>

      <div className={styles.app}>
        <div className={styles.score}>Score: {score}</div>
        {Array.from({ length: tamanho }, (_, y) => (
          <div key={`l${y}`} className={styles.linha}>
            {Array.from({ length: tamanho }, (_, x) => {
              const isCobra = cobra.some(
                (segment) => segment[0] === y && segment[1] === x
              );
              const isComida = comida[0] === y && comida[1] === x;

              return (
                <div
                  className={
                    isCobra
                      ? styles.cobra
                      : styles.quadrado + " " + (isComida ? styles.comida : "")
                  }
                  key={`${x}-${y}`}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
