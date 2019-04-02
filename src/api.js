const Api = {
  getData: async function() {
    const result = await fetch('./data.json')
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else {
          console.warn(`Request failed with reason: ${response.text()}`);
        }
      })
      .then(response => {
        const {Value: {Goods = []}} = response;
        return Goods;
      })
      .catch(error => console.warn(`Request failed with reason: ${error}`));
    return result;
  }
};

export default Api;
