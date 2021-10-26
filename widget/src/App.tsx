import React, { useState } from "react";
import baron from "./assets/baron.png";
import classNames from "classnames";
import "./style.css";

const outComeOptions = [
  {
    id: 1,
    value: 1,
    odds: 1.0,
  },
  {
    id: 2,
    value: 2,
    odds: 2.0,
  },
  {
    id: 3,
    value: 3,
    odds: 3.0,
  },
  {
    id: 4,
    value: 4,
    odds: 4.0,
  },
];

const betValueOptions = [
  {
    id: 1,
    value: 5,
  },
  {
    id: 2,
    value: 10,
  },
  {
    id: 3,
    value: 25,
  },
  {
    id: 4,
    value: 50,
  },
  {
    id: 5,
    value: 100,
  },
  {
    id: 6,
    value: 500,
  },
];

function App() {
  const [outcomeValue, setOutcomeValue] = useState<number | null>(null);
  const [betValue, setBetValue] = useState<number | null>(null);

  const payoutValue =
    betValue !== null && outcomeValue !== null ? betValue * outcomeValue : 0;

  const submitDisabled = outcomeValue === null || betValue === null;

  return (
    <div className="app">
      <header className="header"></header>
      <body className="body">
        <div className="videoContainer">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/Q6727vtiL8E"
            title="YouTube video player"
            frameBorder={0}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="widgetContainer">
          <div className="widget">
            <div className="market">
              <img
                className="baronIcon"
                alt="baron"
                title="baron"
                src={baron}
              />
              <p className="baronTitle">Baron Powerplay</p>
              <p className="marketText">
                How many towers will be destroy during baron buff ?
              </p>
              <div className="outComeContent">
                {outComeOptions.map((option) => (
                  <button
                    key={option.id}
                    className={classNames("outcomeButton", {
                      outcomeButtonSelected: option.value === outcomeValue,
                    })}
                    onClick={() => setOutcomeValue(option.value)}
                  >
                    <p className="outcomeValue">{option.value}</p>
                    <span className="oddsValue">{option.odds}</span>
                  </button>
                ))}
              </div>
            </div>
            <hr className="border" />
            <div className="bet">
              <div className="betValueContent">
                <div className="preSelectedBetValueContent">
                  {betValueOptions.map((item) => (
                    <button
                      className={classNames("preSelectedBetValueButton", {
                        preSelectedBetValueButtonSelected:
                          item.value === betValue,
                      })}
                      onClick={() => setBetValue(item.value)}
                    >
                      {item.value}€
                    </button>
                  ))}
                </div>
                <div className="payoutContent">
                  <p className="payoutText">Potential Payout</p>
                  <p className="payoutValue">{payoutValue}€</p>
                </div>
              </div>
              <button disabled={submitDisabled} className="submitButton">
                Place Bet
              </button>
            </div>
          </div>
        </div>
      </body>
    </div>
  );
}

export default App;
