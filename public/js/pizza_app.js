/*
 * JavaScript code for pizzaApp front-end.
 * 
 * @author Dominik Wlazlowski <dominik-w@dominik-w.pl>
 */

var pizzaApp = {};

// It's just create properties in object, to keep something like "assoc" arrays =>
// shoppingCart['pizzas'] = []; shoppingCart['drinks'] = [];
// For our case simply use separated arrays =>
var shoppingCartPizzas = [];
var shoppingCartDrinks = [];
var shoppingCartAddress = [];
var _total = 0.0;

/***** Define internal settings *****/

var _currency = 'EUR';
var _app_host = 'http://localhost:8080';
var _scroll_speed = 600;

// for simple validation purposes
var _val_min_drinks_only = 10;
var _val_min_pizza_only = 30;

/***** jQuery actions / handlers *****/

jQuery(document).ready(function ($) {

// Handle page scrolling using Easing plugin
    $(function () {
        $('a.page-scroll').bind('click', function (event) {
            var $anch = $(this);

            try {
                $('html, body').stop().animate({
                    scrollTop: $($anch.attr('href')).offset().top
                }, _scroll_speed, 'easeInOutExpo');
            } catch (e) {
                ;
            }
            event.preventDefault();
        });
    });

// If the "scroll to top" button is present, implement simple handler
    if ($('#back-to-top').length > 0) {
        var scrollTrigger = 100; // [px]

        backToTop = function () {
            var scrollTop = $(window).scrollTop();
            if (scrollTop > scrollTrigger) {
                $('#back-to-top').addClass('show');
            } else {
                $('#back-to-top').removeClass('show');
            }
        };
        backToTop();

        $(window).on('scroll', function () {
            backToTop();
        });

        $('#back-to-top').on('click', function (e) {
            e.preventDefault();
            $('html,body').animate({
                scrollTop: 0
            }, _scroll_speed);
        });
    }

// TB dialog drag-drop handlers, jQ UI based;
// If we need draggable dialogs, just enable jquery.ui and uncomment this section
    /*
     $('.modal-dialog').draggable({
     handle: ".modal-header"
     });
     */

// Load the initial data
    pizzaApp.loadPizza();
    pizzaApp.loadDrinks();

});

/***** App methods *****/

/**
 * Load JSON with pizza data via Ajax.
 * @returns void
 */
pizzaApp.loadPizza = function () {
    var url = _app_host + '/pizzas/';

    $.get(url, function () {
        // processData: false
    }).done(function (data) {
        pizzaApp.cb_loadPizza(data);
    }).fail(function () {
        $('#pizzas-items').append("A problem: cannot retrieve menu items.");
    });
};

/**
 * A callback for loadPizza method.
 * 
 * @param string data
 * @returns mixed
 */
pizzaApp.cb_loadPizza = function (data) {
    // data = JSON.parse(data);
    if (data.error > 0) {
        alert(data.msg);

        return false;
    }

    var template = $('#pizzas-grid').html();

    try {
        for (var i = 0; i < data.length; ++i) {
            var obj = data[i];

            // add extra fields - index and formatted price
            obj.index = i;
            obj.price_format = _currency + ' ' + obj.price.toFixed(2);

            var html = Mustache.to_html(template, obj);
            $('#pizzas-items').append(html);
        }
    } catch (e) {
        console.error(e);
    }
};

/**
 * Load JSON with drinks data via Ajax.
 * @returns void
 */
pizzaApp.loadDrinks = function () {
    var url = _app_host + '/drinks/';

    $.get(url, function () {

    }).done(function (data) {
        pizzaApp.cb_loadDrinks(data);
    }).fail(function () {
        $('#drinks-items').append("A problem: cannot retrieve menu items.");
    });
};

/**
 * A callback for loadDrinks method.
 * @param string data
 * @returns mixed
 */
pizzaApp.cb_loadDrinks = function (data) {
    // data = JSON.parse(data);
    if (data.error > 0) {
        alert(data.msg);

        return false;
    }

    // note: in case of more data and types, it could be generated dynamically,
    // based e.g. on data from DB
    var template_soda = $('#drinks-grid-soda').html();
    var template_beer = $('#drinks-grid-beer').html();
    var template_rum = $('#drinks-grid-rum').html();

    var soda = data.Soda;
    var beer = data.Beer;
    var rum = data.Rum;

    try {
        if (soda.length === undefined || soda.length === 0) {
            $('#drinks-items').append('Currently no positions');
        }

        for (var i = 1; i < soda.length; ++i) {
            var obj = soda[i];

            // extra fields
            obj.index = i;
            obj.type = 'soda';
            obj.price_format = _currency + ' ' + obj.price.toFixed(2);

            var html = Mustache.to_html(template_soda, obj);

            $('#drinks-items').append(html);
        }

        // add drink type label
        $('#drinks-items').prepend('<div class="drink-type-label">Soda</div>');

    } catch (e) {
        console.error(e);
    }

    try {
        // add drink type label
        $('#drinks-items').append('<br><div class="drink-type-label">Beer</div>');

        if (beer.length === undefined || beer.length === 0) {
            $('#drinks-items').append('Currently no positions');
        }

        for (var i = 1; i < beer.length; ++i) {
            var obj = beer[i];

            obj.index = i;
            obj.type = 'beer';

            obj.price_format = _currency + ' ' + obj.price.toFixed(2);

            var html = Mustache.to_html(template_beer, obj);

            $('#drinks-items').append(html);
        }
    } catch (e) {
        console.error(e);
    }

    try {
        // add drink type label
        $('#drinks-items').append('<div class="drink-type-label">Rum</div>');

        if (rum.length === undefined || rum.length === 0) {
            $('#drinks-items').append('Currently no positions');
        }

        for (var i = 1; i < rum.length; ++i) {
            var obj = rum[i];

            obj.index = i;
            obj.type = 'rum';

            obj.price_format = _currency + ' ' + obj.price.toFixed(2);

            var html = Mustache.to_html(template_rum, obj);

            $('#drinks-items').append(html);
        }
    } catch (e) {
        console.error(e);
    }
};

/**
 * Process adding pizza item to the cart.
 * 
 * @param string name
 * @param string price
 * @param string idx
 * @returns void
 */
pizzaApp.addPizzaToCart = function (name, price, idx) {

    var pizzaObj = {name: name, price: parseFloat(price)};
    shoppingCartPizzas.push(pizzaObj);

    // update items counter
    var count = shoppingCartPizzas.length + shoppingCartDrinks.length;
    $('#order-items-count').text('(' + count + ')');

    // update data in "Your order" area
    pizzaApp.rebuildOrderArea();

    // some effects on dynamic elements
    $('#blinker-' + idx).show('slow').delay(800).fadeOut(200);
    $('.order-preview').fadeTo('fast', 0.1).fadeTo('fast', 1.0);

};

/**
 * Process adding drink item to the cart.
 * 
 * @param string name
 * @param string price
 * @param string idx
 * @param string idx
 * @returns void
 */
pizzaApp.addDrinkToCart = function (name, price, idx, type) {

    var drinkObj = {name: name, price: parseFloat(price)};
    shoppingCartDrinks.push(drinkObj);

    var count = shoppingCartPizzas.length + shoppingCartDrinks.length;
    $('#order-items-count').text('(' + count + ')');

    pizzaApp.rebuildOrderArea();

    $('#blinker-' + idx + '-' + type).show('slow').delay(800).fadeOut(200);
    $('.order-preview').fadeTo('fast', 0.1).fadeTo('fast', 1.0);

};

/**
 * Update data in "Your order" area.
 * @returns void
 */
pizzaApp.rebuildOrderArea = function () {
    var order = '';
    var total = 0.0;

    // process the order items, in a simple way, without mustache.js engine
    if (shoppingCartPizzas.length > 0) {
        order += '<h3>Pizza</h3>';
    }

    for (var i in shoppingCartPizzas) {
        var obj = shoppingCartPizzas[i];
        total += obj.price;

        order += '<strong>' + obj.name + '</strong> ';
        order += '(' + _currency + ' ' + obj.price.toFixed(2) + ')';
        order += '<div class="divided10"></div>';
    }

    if (shoppingCartDrinks.length > 0) {
        order += '<h3>Drinks</h3>';
    }

    for (var i in shoppingCartDrinks) {
        var obj = shoppingCartDrinks[i];
        total += obj.price;

        order += '<strong>' + obj.name + '</strong> ';
        order += '(' + _currency + ' ' + obj.price.toFixed(2) + ')';
        order += '<div class="divided10"></div>';
    }

    // update total price
    _total = total;

    order += '<div class="divided10"></div>';
    order += '<h2 class="price-total">Total: ' + _currency + ' ' + total.toFixed(2) + '</h2>';

    $('#order-items').html(order);
    $('#submit-area').show();
};

/**
 * Perform simple validation.
 * TODO: Re-factor this part by moving the validation to server-side
 * 
 * @returns void
 */
pizzaApp.validate = function () {

    var msg = '';
    var min = 0;

    // pizza only
    if (shoppingCartPizzas.length > 0 && shoppingCartDrinks.length === 0) {
        min = _val_min_pizza_only;
    }

    // drinks only
    if (shoppingCartPizzas.length === 0 && shoppingCartDrinks.length > 0) {
        min = _val_min_drinks_only;
    }

    // assuming: no minimal price, if user ordered both drink and pizza

    if (_total < min) {
        msg = "The total price of selected products is too low.<br>";
        msg += "For drinks only it's " + _currency + ' ' + _val_min_drinks_only.toFixed(2);
        msg += ", for pizza only it's " + _currency + ' ' + _val_min_pizza_only.toFixed(2);

        $("#pizza-alert-dialog").modal('show');
        $("#alert-validation-msg").html(msg);

        return;
    }

    var phone = $('#user-phone').val();
    var address = $('#user-address').val();

    // the simplest phone / address validation
    if (phone.length === 0 || address.length === 0) {
        msg = 'Phone and address inputs cannot be empty';

        $("#pizza-alert-dialog").modal('show');
        $("#alert-validation-msg").text(msg);

        return;
    }

    var addrObj = {phone: phone, address: address};
    shoppingCartAddress.push(addrObj);

    // OK!
    pizzaApp.submit();
};

/**
 * Submit order.
 * @returns void
 */
pizzaApp.submit = function () {

    var url = _app_host + '/submit';

    // pack whole order and post to the server
    var output = {
        pizzas: shoppingCartPizzas,
        drinks: shoppingCartDrinks,
        address: shoppingCartAddress,
        total: _total.toFixed(2)
    };

    var call = $.ajax({
        type: 'POST',
        data: JSON.stringify(output),
        contentType: 'application/json',
        url: url
    });

    // callbacks
    call.fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });

    call.done(function (data) {
        // console.log(JSON.stringify(data));

        $("#pizza-alert-dialog").modal('show');
        $("#alert-validation-msg").html("<strong>Success: Thank you for the order!</strong>");

        // make cleanups
        shoppingCartPizzas.length = 0;
        shoppingCartDrinks.length = 0;
        shoppingCartAddress.length = 0;
        _total = 0.0;

        $('#order-items-count').text('(0)');
        $('#submit-area').hide();
        $('#order-items').html('No items yet.');
    });

};

// Thank you
