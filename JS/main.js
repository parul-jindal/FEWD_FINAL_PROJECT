class Steps {

    constructor(container, backbutton) {
        this.index = 0;
        this.backbutton = backbutton;
        this.container = container;
        this.list = this.container.find('.steps').first();
        this.steps = this.list.find('.step');

        // Get all measurements
        this.width = this.steps.outerWidth();
        this.containerOffset = (this.container.width() / 2) - (this.width / 2);

        // Run initialization
        this.backbutton.hide();
        this.backbutton.on('click', this.back.bind(this));
        this.backbutton.css('left', this.containerOffset / 2 + 'px');
        $(window).resize(this.onResize.bind(this));
        this.list.css("transform", "translateX(" + this.containerOffset + "px)");
        $(this.steps.get(0)).addClass('selected');
        setTimeout(this.postInitialize.bind(this));
    }

    postInitialize() {
        this.list.addClass("steps-post-initialize");
    }

    renderHideButton() {
        if (this.index === 0) {
            this.backbutton.fadeOut(1000)
        } else {
            this.backbutton.fadeIn(1000);
        }
    }

    onResize() {
        this.width = this.steps.outerWidth();
        this.containerOffset = (this.container.width() / 2) - (this.width / 2);
        this.backbutton.css('left', this.containerOffset / 2 + 'px');
        let xTransform = this.index * this.width;
        this.list.css("transform", "translateX(" + (this.containerOffset - xTransform) + "px)");
    }

    back() {
        this.slideTo(this.index - 1);
    }

    slideTo(index) {
        this.index = index;
        this.renderHideButton();
        this.steps.each(function(i, item) {
            if (index === i) {
                $(item).addClass('selected');
            } else {
                $(item).removeClass('selected');
            }
        })
        let xTransform = index * this.width;
        this.list.css("transform", "translateX(" + (this.containerOffset - xTransform) + "px)");
    }
}

class DropDown {
    constructor(el) {
        this.dropdown = el;
        this.placeholder = this.dropdown.children('span');
        this.opts = this.dropdown.find('ul.dropdown > li');
        this.val = '';
        this.index = -1;
        this.initEvents();
        this.handlers = [];
    }

    initEvents() {
        this.dropdown.on('click', function(event) {
            $(this).toggleClass('active');
            return false;
        });

        this.opts.on('click', function(i) {
            var opt = $(i.delegateTarget);
            this.val = opt.text();
            this.index = opt.index();
            this.placeholder.text(this.val);
            this.handlers.forEach(function(handler) {
                handler(this.index);
            }.bind(this));
        }.bind(this));
    }

    on(fn) {
        this.handlers.push(fn);

    }
}

$().ready(function() {
    let drinkingHabit = null;
    let perception = null;
    let drinkType = null;
    let flavorType = null;
    let gender = null;
    let budget = null;

    let drinkingSelector = new DropDown($('#drinking-habit'));
    let perceptionSelector = new DropDown($('#perception-type'));
    let drinkTypeSelector = new DropDown($('#drink-type'));
    let flavorTypeSelector = new DropDown($('#flavor-type'));
    let steps = new Steps($('.steps-container'), $('#back-button'));

    function showResultInvalid() {
        if (perception === null || drinkType === null || flavorType === null) {
            $('#user-preference .error').show();
            return true;
        } else {
            $('#user-preference .error').hide();
            return false;
        }
    }

    function disableBeginButton() {
        if (drinkingHabit === null || gender === null || budget === null) {
            $('#basic-info .error').show();
            return true;
        } else {
            $('#basic-info .error').hide();
            return false;
        }
    }

    // Initalize content state
    $('.main-loader').hide();
    $('#results').hide();
    $('[data-toggle="tooltip"]').tooltip();
    $('#basic-info .error').hide();
    $('#user-preference .error').hide();

    // Add handlers
    drinkingSelector.on(function(i) {
        drinkingHabit = i;
        disableBeginButton();
    });
    perceptionSelector.on(function(i) {
        perception = i;
        showResultInvalid();
    });
    drinkTypeSelector.on(function(i) {
        drinkType = i;
        showResultInvalid();
    });
    flavorTypeSelector.on(function(i) {
        flavorType = i;
        showResultInvalid();
    });
    $('#welcome-button').click(function() {
        steps.slideTo(1);
    });

    $('#begin-button').click(function() {
        if (disableBeginButton()) {
            return;
        }
        steps.slideTo(2);
    });

    $('input[type=radio][name=Budget]').change(function() {
        budget = this.value;
        disableBeginButton();
    });

    $('.occasion-selector').click(function(event) {
        steps.slideTo(3);
    });

    $('#show-results').click(function() {
        if (showResultInvalid()) {
            return;
        }
        showResults();
    });

    $('#start-over').click(function() {
        $('.steps-container').show();
        $('#results').hide();
        steps.slideTo(0);
    });

    $('#woman').on('click', function() {
        gender = 'woman';
        disableBeginButton();
        $('#woman').addClass('selected');
        $('#man').removeClass('selected');
    });

    $('#man').on('click', function() {
        gender = 'man';
        disableBeginButton();
        $('#woman').removeClass('selected');
        $('#man').addClass('selected');
    });

    // Helper functions
    function renderResultRow(index, data) {
        let image = $('<div>').css({
            height: '100px',
            width: '100px',
            "background-image": "url('IMAGES/" + data.image + "')",
            "background-position": "50%",
            "background-size": 'contains'
        });
        let header = $('<div>').addClass('text-header').html(data.header);
        let desc = $('<div>').html(data.description);
        let item = $('<div>').delay(index * 500).addClass('result-box').css({
            'transition-delay': index * 200 + 'ms',
            '-webkit-animation-delay': index * 200 + 'ms'
        }).append($('<div>').addClass(index % 2 === 0
            ? 'result-text-box'
            : 'result-text-box-right').append(header).append(desc));
        if (index % 2 === 1) {
            item.prepend(image);
        } else {
            item.append(image);
        }
        return item;
    }

    function showWeekendResults() {
        $("#shown-results").empty();
        $("#shown-results").append(renderResultRow(0, {
            header: 'Vodka',
            description: 'Blah blah black sheep have you any wool',
            image: "Absolut_vodka.jpg"
        }));
        $("#shown-results").append(renderResultRow(1, {
            header: 'Whickey',
            description: 'Blah blah black sheep have you any wool',
            image: "Absolut_vodka.jpg"
        }));
        $('#results').show();
    }

    function showResults() {
        $('.steps-container').fadeOut(200, function() {
            $('.main-loader').show().delay(1000).hide(function() {
                showWeekendResults();
            });
        });
    }
});
