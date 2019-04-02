import React, {Component} from 'react';
import store from './names';
import Api from './api';
import {randomCurrency} from './utils';

import Header from './header';
import Goods from './goods';
import Basket from './basket';

import style from './style.styl';

class App extends Component {
  state = {
    currency: randomCurrency(),
    goods: {},
    isFetching: false
  };

  transformData = (data) => {
    const {goods} = this.state;
    let newGoods = {};
    const currency = randomCurrency();

    const newGroup = (groupId) => {
      return {
        name: store[groupId].G,
        items: []
      };
    };

    const getCurrentItem = ({groupId, id}) => {
      if (!Object.keys(goods).length) return false;
      const {items = []} = goods[groupId] || {};
      return items.filter(item => item.id === id)[0] || {};
    };

    const newItem = ({C: price, G: groupId, P: quantity, T: id}) => {
      const currentItem = getCurrentItem({groupId, id}) || false;
      const newPrice = (price * currency);
      return {
        name: store[groupId].B[id].N,
        id,
        groupId: groupId,
        inBasket: currentItem ? currentItem.inBasket : false,
        price: newPrice,
        originPrice: price,
        priceChanged: currentItem ? currentItem.price > newPrice ? 'down' : 'up' : false,
        quantity,
        quantityInBasket: currentItem ? currentItem.quantityInBasket : false
      };
    };

    if (data !== undefined) { // working with newly fetched data

      data.forEach((entry, index) => {
        const {G: groupId} = entry;
        if (!newGoods[groupId]) {
          newGoods[groupId] = newGroup(groupId);
        }
        newGoods[groupId].items.push(newItem(entry));
      });

    } else { // transform existing goods

      Object.entries(goods).forEach(entry => {
        const [groupId, {items}] = entry;
        newGoods[groupId] = newGroup(groupId);
        items.forEach(item => {
          newGoods[groupId].items.push(
            newItem({
              C: item.originPrice,
              G: item.groupId,
              P: item.quantity,
              T: item.id
            })
          );
        })
      });
    }

    this.setState({
      ...this.state,
      currency: currency,
      goods: newGoods,
      isFetching: false
    }, this.timeoutFetch);
  };

  fetchData = () => {
    this.setState({
      isFetching: true
    }, () => {
      Api.getData().then(response => this.transformData(response));
    });
  };

  timeoutFetch() {
    this.timeout = setTimeout(this.fetchData, 15000);
  };

  findItem = ({groupId, id}) => {
    const {goods} = this.state;
    const {items} = goods[groupId];
    const item = items.filter(entry => entry.id === id)[0];
    return {
      items,
      item,
      index: items.indexOf(item)
    };
  };

  addToBasket = ({groupId, id}) => {
    const {basket, goods} = this.state;
    const {items, item, index} = this.findItem({groupId, id});
    item.inBasket = true;
    item.quantityInBasket = 1;
    items[index] = item;
    goods[groupId].items = items;
    this.setState({
      ...this.state,
      basket,
      goods
    });
  };

  handleBasket = ({groupId, id}, action, value) => {
    const {basket, goods} = this.state;
    const {items, item, index} = this.findItem({groupId, id});
    switch (action) {
      case 'decrease':
        item.quantityInBasket = item.quantityInBasket - 1;
        break;
      case 'increase':
        item.quantityInBasket = item.quantityInBasket + 1;
        break;
      case 'set':
        if (item.quantityInBasket < item.quantity) {
          item.quantityInBasket = value
        } else {
          item.quantityInBasket = item.quantity
        }
        break;
      case 'remove':
        item.inBasket = false;
        item.quantityInBasket = 1
        break;
      default:
        break;
    };
    items[index] = item;
    goods[groupId].items = items;
    this.setState({
      ...this.state,
      basket,
      goods
    });
  };

  forceCurrencyChange = () => {
    this.transformData();
  };

  componentDidMount() {
    this.fetchData();
  };

  componentWillMount() {
    clearTimeout(this.timeout);
  };

  render() {
    const {basket, currency, goods, isFetching} = this.state;
    return (
      <main className={style.main}>
        <Header
          currency={currency}
          handleClick={this.forceCurrencyChange}
          reset={isFetching}/>
        <Goods
          goods={goods}
          handleClick={this.addToBasket}
          disabled={isFetching}/>
        <Basket
          goods={goods}
          handleClick={this.handleBasket}
          disabled={isFetching}/>
      </main>
    );
  }

};

export default App;
