import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {displayPrice, plurals} from './utils.js';

import style from './style.styl';

class Basket extends PureComponent {
  state = {
    items: [],
    total: 0
  };

  handleClick = ({groupId, id}, action, value) => {
    this.props.handleClick({groupId, id}, action, value);
  };

  collectBasketItems = ({goods}) => {
    let items = [];
    Object.entries(goods).forEach(entry => entry[1].items.forEach(item => {
      item.inBasket && items.push(item);
    }));
    let total = items.reduce((prev, current) => {
      return prev + (current.price * current.quantityInBasket);
    }, 0);
    this.setState({
      ...this.state,
      items: items,
      total: total
    });
  };

  componentWillMount() {
    this.collectBasketItems(this.props);
  };

  componentWillReceiveProps(nextProps) {
    this.collectBasketItems(nextProps);
  };

  basketItem = ({name, id, groupId, price, quantity, quantityInBasket}, index) => {
    return (
      <section
        key={index}
        className={style.basket__item}>
        <h3 className={style.basket__item_name}>
          {name}
        </h3>
        <div className={style.basket__item_quantity}>
          <div className={style.basket__item_form}>
            <button
              disabled={quantityInBasket === 1}
              onClick={event => quantityInBasket > 1 ? this.handleClick({groupId, id}, 'decrease') : null}
              className={style.basket__item_form_minus}>
              –
            </button>
            <input
              className={style.basket__item_form_input}
              type='number'
              min='1'
              max={quantity}
              onChange={event => this.handleClick({groupId, id}, 'set', event.target.value)}
              value={quantityInBasket}/>
            <button
              disabled={quantityInBasket === quantity}
              onClick={event => quantityInBasket < quantity ? this.handleClick({groupId, id}, 'increase') : null}
              className={style.basket__item_form_plus}>
              +
            </button>
          </div>
          {quantity === 1 ?
            <div className={style.basket__item_form_warning}>
              Количество ограничено
            </div>
          : null}
        </div>
        <div className={style.basket__item_price}>
          {displayPrice(price * quantityInBasket)}
        </div>
        <button
          onClick={event => this.handleClick({groupId, id}, 'remove')}
          className={style.basket__item_delete}>
          ×
        </button>
      </section>
    )
  };

  render() {
    const {goods} = this.props;
    const {items, total} = this.state;
    return (
      <footer
        className={style.basket}>
        <div className={style.basket__wrap}>
          <header className={style.basket__header}>
            В корзине {items.length ? `${items.length} ${plurals(items.length, ['товар', 'товара', 'товаров'])}` : 'пока ничего нет'}
            {total ?
              <div className={style.basket__total}>
                Итого {displayPrice(total)}
              </div>
            : null}
          </header>
          <div className={style.basket__body}>
            {items.length ? items.map(this.basketItem) : null}
          </div>
        </div>
      </footer>
    );
  }
};

Basket.propTypes = {
  goods: PropTypes.object,
  handleClick: PropTypes.func,
  disabled: PropTypes.bool
};
export default Basket;
