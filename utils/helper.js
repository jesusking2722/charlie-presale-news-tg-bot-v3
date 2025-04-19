const formatPrice = (price) => {
  return parseFloat(price.toFixed(5)).toString();
};

const formatNumberWithSpaces = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const weiToUsd = (wei, nativePrice) => {
  const eth = parseFloat(wei) / 1e18;
  return eth * nativePrice;
};

module.exports = { formatPrice, formatNumberWithSpaces, weiToUsd };
