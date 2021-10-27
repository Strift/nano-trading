import React, { useEffect, useState } from "react";
import baron from "./assets/baron.png";
import cross from "./assets/cross.png";
import marteau from "./assets/marteau.png";
import Fireworks from "./Fireworks";
import ProgressBar from "./ProgressBar";
import classNames from "classnames";
import { supabase } from "./SupabaseClient";
import "./style.css";
import { SupabaseRealtimePayload } from "@supabase/supabase-js";
import {
  betValueOptions,
  MAX_DURATION,
  MIN_DURATION,
  outComeTowerOptions,
  outComeWinOptions,
} from "./constants";

interface MarketType {
  activation_date: string;
  created_at: string;
  duration_in_seconds: number;
  enabled: boolean;
  id: number;
  name: "baron_tower" | "baron_win";
  supremacy: null | number;
  supremacy_enabled: boolean;
  totals: null | number;
  totals_enabled: boolean;
}

function App() {
  const [outcomeValue, setOutcomeValue] = useState<number | null>(null);
  const [betValue, setBetValue] = useState<number | null>(null);
  const [submited, setSubmited] = useState(false);
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [widgetAnimationRunning, setWidgetAnimationRunning] = useState(false);
  const [playFirework, setPlayFirework] = useState(false);
  const [now, setNow] = useState(0);
  const [loading, setLoading] = useState(true);

  const [currentMarket, setCurrentMarket] = useState<MarketType | null>(null);

  const outComeOptions =
    currentMarket?.name === "baron_tower"
      ? outComeTowerOptions
      : outComeWinOptions;

  useEffect(() => {
    const maxDuration = currentMarket?.duration_in_seconds ?? MAX_DURATION;
    if (widgetOpen) {
      if (now < maxDuration) {
        setTimeout(() => setNow(now + 0.25), 250);
      }

      if (now === maxDuration) {
        handleCloseWidget();
        setCurrentMarket(null);
      }
    } else {
      setNow(0);
    }
  }, [now, widgetOpen]);

  const handleClickWidget = () => {
    if (widgetOpen) {
      return;
    }
    setWidgetAnimationRunning(true);
    setWidgetOpen(true);
    setTimeout(() => setWidgetAnimationRunning(false), 500);
  };

  const handleSubmit = () => {
    handleCloseWidget();

    setTimeout(() => setSubmited(true), 500);
    setTimeout(() => setPlayFirework(true), 500);
    setTimeout(() => setPlayFirework(false), 3500);
  };

  const handleCloseWidget = () => {
    setWidgetAnimationRunning(true);

    setWidgetOpen(false);
    setTimeout(() => setWidgetAnimationRunning(false), 500);
  };

  const mySubscription = supabase
    .from("markets")
    .on("UPDATE", (payload: SupabaseRealtimePayload<MarketType>) => {
      const newItemDate = new Date(payload.new.activation_date);
      const currentMarketDate = currentMarket
        ? new Date(currentMarket.activation_date)
        : null;

      if (!currentMarket) {
        setCurrentMarket(payload.new);
        setSubmited(false);
        handleClickWidget();
      } else if (newItemDate < currentMarketDate!) {
        setCurrentMarket(payload.new);
        setSubmited(false);
        handleClickWidget();
      }
    })
    .subscribe();

  useEffect(() => {
    getMarket();

    return () => {
      supabase.removeSubscription(mySubscription);
    };
  }, []);

  async function getMarket() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase.from("markets").select(`*`);

      if (error && status !== 406) {
        throw error;
      }

      if (data as MarketType[]) {
        const nextMarket = data?.reduce(
          (acc: MarketType | null, curr: MarketType) => {
            const currDate =
              new Date(curr.activation_date).getTime() +
              parseInt(curr.activation_date);
            const nowDate = new Date().getTime();
            const accDate = acc
              ? new Date(acc.activation_date).getTime()
              : null;

            if (accDate === null && currDate > nowDate) {
              return curr;
            }

            if (accDate && accDate > currDate && currDate > nowDate) {
              return curr;
            }

            return acc;
          },
          null
        );

        setCurrentMarket(nextMarket);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  const payoutValue =
    betValue !== null && outcomeValue !== null ? betValue * outcomeValue : 0;

  const submitDisabled = outcomeValue === null || betValue === null;

  const displayWidget =
    !submited && !loading && currentMarket && currentMarket.enabled;

  return (
    <div className="app">
      {submited && playFirework && <Fireworks />}
      <header className="header"></header>
      <div
        className={classNames("body", {
          body2: submited === true,
        })}
      >
        <div className="videoContainer">
          <iframe
            width="1006"
            height="566"
            src="https://www.youtube.com/embed/6QcawgrIaGs?autoplay=1"
            title="YouTube video player"
            frameBorder={0}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="widgetContainer">
          {displayWidget && (
            <div
              className={classNames("widget", {
                widgetOpen: widgetOpen,
                widgetClose: !widgetOpen,
              })}
              onClick={handleClickWidget}
            >
              {!widgetOpen && !widgetAnimationRunning && (
                <img src={marteau} alt="marteau" title="marteau" />
              )}
              {widgetOpen && !widgetAnimationRunning && (
                <>
                  <div className="cross" onClick={handleCloseWidget}>
                    <img
                      className="crossImg"
                      src={cross}
                      alt="cross"
                      title="cross"
                    />
                  </div>
                  <div className="market">
                    <img
                      className="baronIcon"
                      alt="baron"
                      title="baron"
                      src={baron}
                    />
                    <p className="baronTitle">Baron Powerplay</p>
                    <p className="marketText">
                      {currentMarket.name === "baron_tower"
                        ? "How many towers will DK destroy before Baron buff ends?"
                        : "Will DWG win the game before Baron buffs ends?"}
                    </p>
                    <div className="outComeContent">
                      {outComeOptions.map((option) => (
                        <button
                          key={option.id}
                          className={classNames("outcomeButton", {
                            outcomeButtonSelected: option.odds === outcomeValue,
                          })}
                          onClick={() => setOutcomeValue(option.odds)}
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
                            key={item.id}
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
                    <button
                      onClick={handleSubmit}
                      disabled={submitDisabled}
                      className="submitButton"
                    >
                      Place Bet
                    </button>
                    <div className="progressBarContainer">
                      <ProgressBar
                        size="small"
                        color="#c83ba3"
                        min={MIN_DURATION}
                        max={currentMarket?.duration_in_seconds ?? MAX_DURATION}
                        now={now}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
