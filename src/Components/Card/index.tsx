import React from 'react';
import './style.css'
interface ICard {
    code: string
}

const Card = (props: ICard) => {
    const getCardValue = () => {
        let value = props.code.charAt(0);
        if (value === '0') {
            return 'A';
        }
        return value;
    };
    const getCardSymbol = () => {
        switch (props.code.charAt(1)) {
            case 'H':
                return '♥';
            case 'S':
                return '♠️';
            case 'D':
                return '♦';
            case 'C':
                return '♣';
        }
        return '';
    };
    const getCardColor = () => {
        let symbol = props.code.charAt(1)
        if (symbol === 'H' || symbol === 'D') {
            return "red";
        }
        return "black";
    }

    return (
        <div className="card-container">
            <div className="card-value-top">{ getCardValue() }</div>
            <div className={`card-symbol ${getCardColor()}`}>{ getCardSymbol() }</div>
            <div className="card-value-bottom">{ getCardValue() }</div>            
        </div>
    );
};

export default Card;