import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Card from './Components/Card';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

interface ICard {
  image: string,
  value: string,
  suit: string,
  code: string
}
interface IApiResponse {
  data: any
}
interface IShuffleApiResponse {
  success: boolean,
  deck_id: string,
  remaining: number
}
interface IDrawApiResponse {
  success: boolean,
  deck_id: string,
  remaining: number,
  cards: Array<ICard>
}

function App() {
  const [cards, setCards] = useState<Array<ICard>>([]);
  const [deckId, setDeckID] = useState('');
  const [remainCard, setRemainCard] = useState(-1);
  const [currentCard, setCurrentCard] = useState(-1);
  const [score, setScore] = useState(0);

  const shuffleCard = async () => {
    try {
      let resp: IApiResponse = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
      let respShuffle: IShuffleApiResponse = resp.data;
      if (!respShuffle.success) {
        toast("Can not shuffle cards");
        return;
      }
      let deckId = respShuffle.deck_id;
      setDeckID(deckId);
      let totalCard = respShuffle.remaining;
      setRemainCard(totalCard - 1);
      resp = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${totalCard}`);
      let respDraw: IDrawApiResponse = resp.data;
      if (!respDraw.success) {
        toast("Can not shuffle cards");
        return;
      }
      let cards: Array<ICard> = respDraw.cards;
      console.log(cards);
      setCards(cards);
      setCurrentCard(0);
   } catch (e) {
      console.log(e);
      toast("Can not shuffle cards");
    }
  }
  useEffect(() => {
    shuffleCard();
  }, []);
  if (currentCard < 0) {
    return null;
  }
  const getCardValue = (index: number) => {
    let value = cards[index].code.charAt(0);
    if (value === '0') {
      return 10;
    }
    if (value === 'J') {
      return 11;
    }
    if (value === 'Q') {
      return 12;
    }
    if (value === 'K') {
      return 13;
    }
    return parseInt(value);
  };
  const onGuess = (guess: number) => {
    if (remainCard === 0) {
      confirmAlert({
        title: 'Confirm score',
        message: `Your score is ${score}. Do you want play again?`,
        buttons: [
          {
            label: 'Yes',
            onClick: () => { shuffleCard() }
          },
          {
            label: 'No',
            onClick: () => {}
          }
        ]
      });
      return;
    }
    let codeBefore = getCardValue(currentCard);
    let codeAfter = getCardValue(currentCard + 1);
    if ((codeBefore < codeAfter && guess === 1) || (codeBefore > codeAfter && guess === 0)) {
      toast("You guess correctly :)");
      setScore(score + 1);
    } else {
      toast("You guess incorrectly :(");
    }
    setRemainCard(remainCard - 1);
    setCurrentCard(currentCard + 1);
  };

  return (
    <div className="App">
      <div className="title">Guess if the next card is higher or lower</div>
      <div className="score-panel">
        <div>Remaining: {remainCard}</div>
        <div>Score: {score}</div>
      </div>
      <div className="card-row">
        {/* <Card code={cards[currentCard].code} /> */}
        <img src={cards[currentCard].image} />
      </div>
      <div className="guess-btns">
        <button onClick={() => onGuess(1)}>HIGH</button>
        <button onClick={() => onGuess(0)}>LOW</button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
