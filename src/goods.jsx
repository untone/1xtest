import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

import {displayPrice, plurals} from './utils.js';

import style from './style.styl';

const Goods = ({goods, handleClick, disabled}) => {

  const goodsItem = ({name, id, groupId, inBasket, price, priceChanged, quantity}, index) => {
    const clickDisabled = disabled || inBasket;
    const priceChangedClass = style[`goods__section_price--${priceChanged}`];
    return (
      <section
        key={index}
        className={style.goods__section}>
        <h3 className={style.goods__section_header}>
          {name}
        </h3>
        <footer className={style.goods__section_footer}>
          <div className={style.goods__section_column}>
            <div className={`${style.goods__section_price} ${priceChanged ? priceChangedClass : ''}`}>
              {displayPrice(price)}
            </div>
            <div className={style.goods__section_quantity}>
              {quantity} {plurals(quantity, ['штука', 'штуки', 'штук'])}
            </div>
          </div>
          <div className={style.goods__section_column}>
            <button
              className={style.goods__section_button}
              onClick={event => clickDisabled ? null : handleClick({groupId, id})}
              disabled={inBasket}>
              {inBasket ? 'В корзине' : 'В корзину'}
            </button>
          </div>
        </footer>
      </section>
    );
  };

  const goodsGroup = ([groupId, {name, items}], index) => {
    if (!items.length) return null;
    return (
      <Fragment key={index}>
        <h2 className={style.goods__header}>
          {name}
        </h2>
        <article className={style.goods__article}>
          {items.map(goodsItem)}
        </article>
      </Fragment>
    );
  };

  goodsItem.propTypes = {
    name: PropTypes.object,
    id: PropTypes.number,
    groupId: PropTypes.number,
    inBasket: PropTypes.bool,
    price: PropTypes.number,
    priceChanged: PropTypes.bool,
    quantity: PropTypes.number
  };

  goodsGroup.propTypes = {
    groupId: PropTypes.number,
    name: PropTypes.object,
    items: PropTypes.array
  };

  if (!Object.keys(goods).length) return null;
  return Object.entries(goods).map(goodsGroup);
};

Goods.propTypes = {
  goods: PropTypes.object,
  handleClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default Goods;
