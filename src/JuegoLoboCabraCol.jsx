import React, { useState, useEffect } from 'react';
import cabraImg from './assets/cabra.png';
import loboImg from './assets/lobo.png';
import colImg from './assets/col.png';
import barcaImg from './assets/barca.png';
import fondoImg from './assets/fondo_paisaje.png';
import './Juego.css';

const imagenes = {
  Cabra: cabraImg,
  Lobo: loboImg,
  Col: colImg
};

const JuegoLoboCabraCol = () => {


    const [izquierda, setIzquierda] = useState(['Lobo', 'Cabra', 'Col']);
    const [derecha, setDerecha] = useState([]);
    const [barca, setBarca] = useState([]);
    const [ladoBarca, setLadoBarca] = useState('izquierda');
    const [mensaje, setMensaje] = useState('');
    const [animando, setAnimando] = useState(false);
    const [finDelJuego, setFinDelJuego] = useState(false); // bloquea acciones
    const [resultado, setResultado] = useState(null); // 'gana' | 'pierde'
    const [razonPerdida, setRazonPerdida] = useState(''); // texto explicativo
    const [mostrarBienvenida, setMostrarBienvenida] = useState(true);
    const [mostrarInstrucciones, setMostrarInstrucciones] = useState(false);
    const popupActivo = mostrarBienvenida || mostrarInstrucciones || finDelJuego;
    const [tiempoRestante, setTiempoRestante] = useState(120); // 120 segundos
    const [cronometroActivo, setCronometroActivo] = useState(true);

    useEffect(() => {
        if (derecha.length === 3 && !finDelJuego) {
            setMensaje('¡Has ganado! 🎉');
            setResultado('gana');
            setFinDelJuego(true);
            setCronometroActivo(false); // ⛔ Detener cronómetro al ganar
        }
    }, [derecha, finDelJuego]);

    useEffect(() => {
        if (!cronometroActivo || finDelJuego || mostrarBienvenida || mostrarInstrucciones) return;

        const intervalo = setInterval(() => {
            setTiempoRestante(prev => {
                if (prev <= 1) {
                    clearInterval(intervalo);
                    setFinDelJuego(true);
                    setResultado('pierde');
                    setRazonPerdida('⏰ ¡Se acabó el tiempo! Luffy no logró cruzar a todos.');
                    setMensaje('⏰ ¡Se acabó el tiempo! Luffy no logró cruzar a todos.');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(intervalo);
    }, [cronometroActivo, finDelJuego, mostrarBienvenida, mostrarInstrucciones]);



    const moverElemento = (elemento) => {
        if (animando || finDelJuego) return;
            const origen = ladoBarca === 'izquierda' ? izquierda : derecha;
            const setOrigen = ladoBarca === 'izquierda' ? setIzquierda : setDerecha;

            // Si el elemento ya está en la barca → bajarlo
            if (barca.length === 1 && barca[0] === elemento) {
                setOrigen([...origen, elemento]);
                setBarca([]);
                return;
            }

            let nuevaOrigen = [...origen];
            let nuevoBarca = [elemento];

            // Si ya hay un elemento en la barca, regresarlo primero al origen
            if (barca.length === 1) {
                nuevaOrigen.push(barca[0]);
            }

            // Quitar el nuevo elemento del origen (para no duplicarlo)
            nuevaOrigen = nuevaOrigen.filter(e => e !== elemento);

            setOrigen(nuevaOrigen);
            setBarca(nuevoBarca);
    };

    const esSituacionInvalida = (lado) => {
        if (lado.includes('Lobo') && lado.includes('Cabra') && !lado.includes('Col')) {
            setMensaje('¡El lobo se comió a la cabra! 😵');
            setResultado('pierde');
            setRazonPerdida('Dejaste al lobo con la cabra sin supervisión.');
            setFinDelJuego(true);
            return true;
        }
        if (lado.includes('Cabra') && lado.includes('Col') && !lado.includes('Lobo')) {
            setMensaje('¡La cabra se comió la col! 😵');
            setResultado('pierde');
            setRazonPerdida('Dejaste a la cabra con la col sin supervisión.');
            setFinDelJuego(true);
            return true;
        }
        return false;
    };




    const moverBarca = () => {
        if (animando || finDelJuego) return;
        const origen = ladoBarca === 'izquierda' ? izquierda : derecha;
        const destino = ladoBarca === 'izquierda' ? derecha : izquierda;
        const setDestino = ladoBarca === 'izquierda' ? setDerecha : setIzquierda;
        const setOrigen = ladoBarca === 'izquierda' ? setIzquierda : setDerecha;

        // Inicia animación
        setAnimando(true);

        setTimeout(() => {
            // 1. Mover el pasajero (si hay uno)
            if (barca.length === 1) {
                setDestino([...destino, barca[0]]);
                setBarca([]);
            }

            // 2. Cambiar el lado de la barca
            const nuevoLado = ladoBarca === 'izquierda' ? 'derecha' : 'izquierda';
            setLadoBarca(nuevoLado);

            // 3. Validar pérdida con lo que quedó atrás (después del movimiento)
            setTimeout(() => {
            const ladoQueQuedó = nuevoLado === 'izquierda' ? derecha : izquierda;
            if (esSituacionInvalida(ladoQueQuedó)) {
                setAnimando(false);
                return;
            }
            setAnimando(false);
            }, 250); // espera medio segundo después de animación
        }, 500); // duración de la animación principal
    };

    const verificarEstado = () => {
        if (derecha.length === 3) {
            setMensaje('¡Has ganado! 🎉');
            setResultado('gana');
            setFinDelJuego(true);
        } else {
            setMensaje('');
        }
    };


    const reiniciar = () => {
        setIzquierda(['Lobo', 'Cabra', 'Col']);
        setDerecha([]);
        setBarca([]);
        setLadoBarca('izquierda');
        setMensaje('');
        setAnimando(false);
        setFinDelJuego(false);
        setResultado(null);
        setRazonPerdida('');
        setTiempoRestante(120);
        setCronometroActivo(true);
    };

    const renderZona = (lista, lado) => {
        const ladoActivo = ladoBarca === lado.toLowerCase(); // si está en ese lado

        return (
            <div className="orilla">
            {lista.map((e) => (
                <img
                key={e}
                src={imagenes[e]}
                alt={e}
                className={`item ${ladoActivo ? 'clickable' : 'disabled'}`}
                onClick={() => ladoActivo && moverElemento(e)}
                style={{
                    cursor: ladoActivo && !finDelJuego ? 'pointer' : 'not-allowed'
                }}
                />
            ))}
            </div>
        );
    };

    return (
        <div className="fondo-container">
            <div
                className="juego"
                style={{
                backgroundImage: `url(${fondoImg})`
                }}
            >
                <div className="cronometro">
                    ⏱ Tiempo restante: {Math.floor(tiempoRestante / 60)}:{(tiempoRestante % 60).toString().padStart(2, '0')}
                </div>
                {/* Orillas con los personajes */}
                <div className="orillas">
                <div className="zona-izquierda">
                    {renderZona(izquierda, 'Izquierda')}
                </div>
                <div className="zona-derecha">
                    {renderZona(derecha, 'Derecha')}
                </div>
                </div>

                {/* Barca + Pasajero */}
                <div className={`barca-area ${ladoBarca}`}>
                <img src={barcaImg} alt="barca" className="barca" />
                {barca.length > 0 && (
                    <img src={imagenes[barca[0]]} alt={barca[0]} className="pasajero" />
                )}
                </div>

                {/* Controles y mensaje */}
                <div className="panel-control">
                    <div className="botones">
                        <button onClick={moverBarca} disabled={animando || popupActivo}>Mover barca</button>
                        <button onClick={reiniciar} disabled={popupActivo}>Reiniciar</button>
                        <button onClick={() => setMostrarInstrucciones(true)} disabled={popupActivo}>Ver reglas</button>
                    </div>
                    <p className="mensaje">{mensaje}</p>
                </div>


                {/* ✅ Popup va aquí */}
                {finDelJuego && (
                <div className={`popup ${resultado === 'gana' ? 'popup-ganar' : 'popup-perder'}`}>
                    <h2>{resultado === 'gana' ? '¡Ganaste! 🎉' : '¡Perdiste! 😵'}</h2>
                    {resultado === 'pierde' && <p>{razonPerdida}</p>}
                    <button onClick={reiniciar}>Reiniciar</button>
                </div>
                )}
                {mostrarBienvenida && (
                <div className="popup popup-bienvenida">
                    <h2>🎮 El cruce salvaje de Luffy</h2>
                    <p><strong>Reglas del juego:</strong></p>
                    <ul style={{ textAlign: 'left', paddingLeft: '1rem' }}>
                    <li>Solo puedes llevar un pasajero en la barca a la vez.</li>
                    <li>Si dejas al lobo solo con la cabra, ¡el lobo se la comerá! 🐺➡️🐐</li>
                    <li>Si dejas la cabra con la col, ¡la cabra se la comerá! 🐐➡️🥬</li>
                    <li>Debes llevar a todos sanos y salvos al otro lado del río.</li>
                    </ul>
                    <button onClick={() => setMostrarBienvenida(false)}>Comenzar</button>
                </div>
                )}
                {mostrarInstrucciones && (
                <div className="popup popup-bienvenida">
                    <h2>🎮 El cruce salvaje de Luffy</h2>
                    <p><strong>Reglas del juego:</strong></p>
                    <ul style={{ textAlign: 'left', paddingLeft: '1rem' }}>
                    <li>Solo puedes llevar un pasajero en la barca a la vez.</li>
                    <li>Si dejas al lobo solo con la cabra, ¡el lobo se la comerá! 🐺➡️🐐</li>
                    <li>Si dejas la cabra con la col, ¡la cabra se la comerá! 🐐➡️🥬</li>
                    <li>Debes llevar a todos sanos y salvos al otro lado del río.</li>
                    </ul>
                    <button onClick={() => setMostrarInstrucciones(false)}>Cerrar</button>
                </div>
                )}
            </div>
        </div>

    );

};

export default JuegoLoboCabraCol;
