import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {displayPrice, plurals} from './utils.js';

import style from './style.styl';

class Header extends Component {
  state = {
    counter: 15
  };

  decrement = () => {
    this.interval = setInterval(() => {
      this.setState({
        counter: this.state.counter - 1
      });
    }, 1000);
  };

  componentDidMount() {
    this.decrement();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.reset) {
      clearInterval(this.interval);
      this.setState({
        counter: 15
      }, this.decrement);
    }
  };


  componentWillMount() {
    clearInterval(this.interval);
  };

  render() {
    const {currency, handleClick, reset} = this.props;
    const {counter} = this.state;
    return (
      <header className={style.header}>
        <div className={style.header__wrap}>
          <div className={style.header__currency}>
            $1 = {displayPrice(currency)}
            <button
              className={style.header__button}
              onClick={reset ? null : handleClick}
              disabled={reset}>
              Обновить курс
            </button>
          </div>
          <div>
            {counter > 0 ?
              `Данные обновятся через ${counter} ${plurals(counter, ['секунду', 'секунды', 'секунд'])}`
              : 'Обновление...'}
          </div>
        </div>
      </header>
    );
  };
};

Header.propTypes = {
  currency: PropTypes.number,
  handleClick: PropTypes.func,
  reset: PropTypes.bool
};


export default Header;
