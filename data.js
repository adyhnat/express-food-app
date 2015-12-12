/**
 * Simple app input data.
 */

var pizzaList = [
    {
        name: "Margherita",
        price: 20.99,
        details: "Lorem ipsum",
        img: "img/pizza.jpg"
    },
    {
        name: "Salami",
        price: 24,
        details: "Dolor sit amet",
        img: "img/pizza.jpg"
    },
    {
        name: "Pizza Super Good, with a long name",
        price: 44,
        details: "Great pizza with extra cheese, corn and bacon",
        img: "img/pizza.jpg"
    },
    {
        name: "Pepperoni",
        price: 20,
        details: "Lorem ipsum Pepperoni",
        img: "img/pizza.jpg"
    }
];

var drinkList = [
    {
        name: "Coca-Cola",
        price: 5,
        type: "Soda",
        img: "img/soda.jpg"
    },
    {
        name: "Sprite",
        price: 6,
        type: "Soda",
        img: "img/soda.jpg"
    },
    {
        name: "Corona",
        price: 6,
        type: "Beer",
        img: "img/beer.jpg"
    },
    {
        name: "Pilsner X",
        price: 6.2,
        type: "Beer",
        img: "img/beer.jpg"
    },
    {
        name: "Eichbaum",
        price: 8,
        type: "Beer",
        img: "img/beer.jpg"
    },
    {
        name: "Guiness Special Export",
        price: 8.3,
        type: "Beer",
        img: "img/beer.jpg"
    },
    {
        name: "Binary Beer",
        price: 5.4,
        type: "Beer",
        img: "img/beer.jpg"
    },
    {
        name: "Satan",
        price: 5.7,
        type: "Beer",
        img: "img/beer.jpg"
    },
    {
        name: "Duvel",
        price: 6.75,
        type: "Beer",
        img: "img/beer.jpg"
    },
    {
        name: "Asahi",
        price: 4.55,
        type: "Beer",
        img: "img/beer.jpg"
    },
    {
        name: "Dragon",
        price: 4.45,
        type: "Beer",
        img: "img/beer.jpg"
    },
    {
        name: "Stuff Beer",
        price: 4.45,
        type: "Beer",
        img: "img/beer.jpg"
    },
    {
        name: "Malibu",
        price: 7.75,
        type: "Rum",
        img: "img/rum.jpg"
    },
    {
        name: "Captain Morgan",
        price: 7.75,
        type: "Rum",
        img: "img/rum.jpg"
    },
    {
        name: "Matusalem",
        price: 9.35,
        type: "Rum",
        img: "img/rum.jpg"
    }
];

// group drinks by type, to display them grouped in "categories"
var drinkListByType = {};

for (var i = 0; i < drinkList.length; ++i) {
    var obj = drinkList[i];

    // create the "type key" if missing
    if (drinkListByType[obj.type] === undefined) {
        drinkListByType[obj.type] = [obj.type];
    }

    // pack the rest of the data to temporary object
    var tmp = {
        name: obj.name,
        price: obj.price,
        img: obj.img
    };

    drinkListByType[obj.type].push(tmp);
}

data = {
    pizzaList: pizzaList,
    drinkList: drinkList,
    drinkListByType: drinkListByType
};

module.exports = data;
