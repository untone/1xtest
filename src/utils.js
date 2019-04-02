const displayPrice = (price) => price.toLocaleString('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});

const plurals = (index, forms) => {
  let number = Math.abs(parseInt(index, 10));
  number %= 100;
  if (number > 10 && number < 20) {
    return forms[2] ? forms[2] : forms[1];
  }
  number %= 10;
  return forms[number > 1 && number < 5 ? 1 : number === 1 ? 0 : forms[2] ? 2 : 1];
};

const randomCurrency = () => Math.floor(20 + Math.random() * (80 + 1 - 20));

export {displayPrice, plurals, randomCurrency};
