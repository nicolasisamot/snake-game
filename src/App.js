import styles from "./App.module.css";
import { useEffect, useState } from "react";

function App() {
  const tamanho = 20;
  const [cobra, setCobra] = useState([[8, 5]]);
  const [gameOver, setGameOver] = useState(false);
  const [direcao, setDirecao] = useState("");
  const [comida, setComida] = useState([
    Math.floor(Math.random() * tamanho),
    Math.floor(Math.random() * tamanho),
  ]);
  const [highscore, setHighscore] = useState(0);
  const [score, setScore] = useState(0);
  const [jogar, setJogar] = useState(false);
  const [direcaoInicial, setDirecaoInicial] = useState(true);

  useEffect(() => {
    let intervalo;
    if (jogar && !gameOver) {
      if (direcao != "" && direcaoInicial == false) {
        intervalo = setInterval(() => {
          moverCobra();
        }, 100);
      }
    }

    return () => clearInterval(intervalo);
  }, [cobra, jogar, direcaoInicial]);

  function moverCobra() {
    console.log("moveu");

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
        if (score > highscore) {
          setHighscore(score);
        }
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
          if (direcaoInicial === true) {
            setDirecaoInicial(false);
          }
          if (direcao !== "left") setDirecao("right");
          break;
        case "ArrowLeft":
          if (direcaoInicial === true) {
            setDirecaoInicial(false);
          }
          if (direcao !== "right") setDirecao("left");
          break;
        case "ArrowUp":
          if (direcaoInicial === true) {
            setDirecaoInicial(false);
          }
          if (direcao !== "down") setDirecao("up");
          break;
        case "ArrowDown":
          if (direcaoInicial === true) {
            setDirecaoInicial(false);
          }
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

      {gameOver && (
        <div className={styles.gameOver}>
          <h2 className={styles.textoGameOver}>Game Over</h2>
          <button
            className={styles.btnJogarNovamente}
            onClick={() => {
              setDirecaoInicial(true);
              setCobra([[8, 5]]);
              setDirecao("");
              setComida([
                Math.floor(Math.random() * tamanho),
                Math.floor(Math.random() * tamanho),
              ]);
              setScore(0);
              setGameOver(false);
            }}
          >
            Jogar Novamente
          </button>
        </div>
      )}
      {!jogar ? (
        <button className={styles.btnJogar} onClick={() => setJogar(true)}>
          Jogar
        </button>
      ) : (
        <div className={styles.app}>
          <div className={styles.grid}>
            <div className={styles.score}>Score: {score}</div>
            <div className={styles.score}>High Score: {highscore}</div>
          </div>

          {direcaoInicial && (
            <div className={styles.direcao}>
              <p>Selecione uma direção</p>
              <img className={styles.arrow} src="/arrows.png"></img>
            </div>
          )}
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
                        : styles.quadrado +
                          " " +
                          (isComida ? styles.comida : "")
                    }
                    key={`${x}-${y}`}
                  ></div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
