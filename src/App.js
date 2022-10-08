import './App.css';
import React, { useState, useRef } from 'react';
import bell1 from './bell1.mp3';
import bell2 from './bell2.mp3';
import useSound from 'use-sound';

const App = () => {

  const Ref = useRef(null);
  const [play1] = useSound(bell1);
  const [play2] = useSound(bell2);

  const [timer, setTimer] = useState('00:00:00');
  const [target, setTarget] = useState(60);
  const [remLoops, setRemLoops] = useState(1);
  const [remSec, setRemSec] = useState(10);
  const [timerOn, setTimerOn] = useState(false);

  const getNumberWithOrdinal = (n) => {
    var s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return "" + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    setRemSec(Math.floor(total / 1000));
    return {
      total, hours, minutes, seconds
    };
  }

  const showTimer = (hours, minutes, seconds) => {
    return (hours > 9 ? hours : '0' + hours) + ':' +
      (minutes > 9 ? minutes : '0' + minutes) + ':'
      + (seconds > 9 ? seconds : '0' + seconds)
  }

  const startTimer = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(
        showTimer(hours, minutes, seconds)
      )
      if (total === 0) {
        setRemLoops(l => l + 1);
        clearTimer(getDeadTime());
      }
    }
  }

  const stopTimer = () => {
    setTimerOn(false)
    if (Ref.current) clearInterval(Ref.current);
    Ref.current = null;

  }

  const clearTimer = (e) => {
    setTimerOn(true);
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000)
    Ref.current = id;
  }

  const getDeadTime = () => {
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + target);
    return deadline;
  }

  const onClickStart = () => {
    setRemLoops(1);
    clearTimer(getDeadTime());
  }

  const onClickStop = () => {
    stopTimer();
  }

  return (
    <div className="App">
      {
        remSec <= 3 && remSec > 0 && play1()
      }
      {
        remSec === 0 && play2()
      }
      <label className='Target'>Lap time (sec):<input
        className='Target'
        type="number"
        value={target}
        onChange={(event) => {
          setTarget(+event.target.value);
          onClickStop();
        }}
      /></label>
      <h1 className="Timer">{remLoops}
        <span className='Ordinal'>{getNumberWithOrdinal(remLoops)}  </span>
      </h1>
      <h1 className="Timer">{timer}</h1>
      {
        timerOn ? <button className="Button stop" onClick={onClickStop}>Stop</button> :
          <button className="Button start" onClick={onClickStart}>Start</button>
      }
    </div>
  )
}

export default App;
