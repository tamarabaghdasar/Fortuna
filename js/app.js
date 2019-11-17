var sheet = document.styleSheets[0];
var newElem = 0;
var lastRound = 0;
var lastPacketVersion = 0;
var roundTime = 120;

$('#preload-frame').show();
$(window).load(function(){
    build();
    btext();
    window.processingInstance = new Processing(document.getElementById('wheel-canvas'), wheel);
});
$(window).resize(function(){
    build();
    btext();
});
function addCSSRule(selector, newRule) {
    if (window.sheet.addRule) window.sheet.addRule(selector, newRule);
    else { ruleIndex = window.sheet.cssRules.length; window.sheet.insertRule(selector + '{' + newRule + ';}', ruleIndex); }
}
function build(){
    var canvasSize,elem,tmp,tmp1,tmp2,tmp3;
    tmp = $(window).width();
    tmp1 = parseInt(0.65*tmp);
    tmp2 = parseInt(0.35*tmp) - 1;
    addCSSRule('#left-side', 'width:' + tmp1 + 'px !important');
    addCSSRule('#right-side', 'width:' + tmp2 + 'px !important');
    elem = $('#left-side');
    if (elem.outerWidth() > $(window).height()) {
        tmp = (elem.outerWidth() - $(window).height())/2;
        tmp3 = tmp + 63;
        addCSSRule('#wheel-canvas', 'margin-left:' + tmp3 + 'px !important;margin-right:' + tmp + 'px !important');
        canvasSize = $(window).height();
        addCSSRule('#wheel-canvas', 'width:' + canvasSize + 'px !important;height:' + canvasSize + 'px !important');
    }
    else if (elem.outerWidth() < $(window).height()) {
        tmp = ($(window).height() - elem.outerWidth())/2;
        addCSSRule('#wheel-canvas', 'margin-top:' + tmp + 'px !important;margin-bottom:' + tmp + 'px !important');
        canvasSize = elem.outerWidth();
        addCSSRule('#wheel-canvas', 'width:' + canvasSize + 'px !important;height:' + canvasSize + 'px !important');
    }
    else {
        canvasSize = (elem.outerWidth() + $(window).height())/2;
        addCSSRule('#wheel-canvas', 'width:' + canvasSize + 'px !important;height:' + canvasSize + 'px !important');
    }
}
function btext(){
    var tmp;
    tmp = parseInt(($(window).width() + $(window).height())/140);
    addCSSRule('#lost-cap', 'font-size:' + tmp + 'px !important');
    tmp = parseInt(($('#right-side').outerWidth() + $('#right-side').outerHeight())/105);
    addCSSRule('#right-side div table', 'font-size:' + tmp + 'px !important');
    addCSSRule('.target', 'width:' + 1.3*tmp + 'px !important;height:' + 1.3*tmp + 'px !important');
    tmp = parseInt($('#left-side').outerWidth()/36);
    addCSSRule('#round', 'font-size:' + tmp + 'px !important');
    tmp = parseInt($('#left-side').outerWidth()/55);
    addCSSRule('#step', 'font-size:' + tmp + 'px !important');
    tmp = tmp + 6;
    addCSSRule('#step span:nth-child(2)', 'font-size:' + tmp + 'px !important');

    tmp = $('#right-side').offset().left - $('#step').outerWidth() - 40;
    addCSSRule('#step', 'left:' + tmp + 'px !important');

}
function lookAtMe(){$('#preload-frame').fadeOut(600)}


function number_format(number, decimals, dec_point, thousands_sep) {
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

//translate
var TRANSLATE  = {};

if ($.cookie('lingua')) {
    $.getScript( 'js/lang/' + $.cookie('lingua') + '.js', function( data, textStatus, jqxhr ) {
        reTranslate(TRANSLATE);
    });
}
else if($.url().param('lng') != '') {
    $.getScript( 'js/lang/' + $.url().param('lng') + '.js', function( data, textStatus, jqxhr ) {
        reTranslate(TRANSLATE);
    });
}

function reTranslate(trans){
    for(var key in trans) {
        var val = trans[key];
        var elem = $('.translate.' + key).html(val);
    }
}




// Ð°ÐºÑ‚Ð¸Ð²Ð½Ð¾ÑÑ‚Ð¸

$('#right-side').click(function(){
    window.newElem = 1;
});

/*
 Ð¿Ð¾Ñ‚ÐµÑ€Ñ ÑÐ¾ÐµÐ´Ð¸Ð½ÐµÐ½Ð¸Ñ
 $('#lost-conn').fadeIn(300);
 $('#lost-conn').fadeOut(300);
 */

var toTimer = function(val) {
    var seconds = Math.round(val/1) % roundTime;
    if (seconds < 10) {
        return "0:0" + seconds;
    }
    return "0:" + seconds;
};
var toRadians = function(val) {
    var seconds = (val/1) % roundTime;
    return 2-2*(seconds/roundTime);
};

//mag dev
//
var ajaxCall, displayError, fortunaUpdate, retry, updateScreen;
var state = 'betting'; //or playing

ajaxCall = function(url, callback) {
    return $.ajax(url, {
        type: "GET",
        dataType: "json",
        timeout: 10000,
        success: function(data) {
            return callback(false, data);
        },
        error: function() {
            return callback(true, null);
        }
    });
};

retry = function(f) {
    return setTimeout(f, 1000);
};

displayError = function() {};

updateScreen = function(data) {
    var time = data.time;
    data = data.state;
    lastPacketVersion = data.vsn;

    //update round
    if(data.round != lastRound && isFirstCall) {
        lastRound = data.round;
        $('#round .value').html((lastRound));
    }

    roundTime = (data.time2switch - data.stamp) | 0;


    //timer
    tick = roundTime - Math.round(data.time2switch - time);
    updateTimer(tick);

    if(isFirstCall && data.state == 'playing') {
        $('#lost-conn').show();
        $('#wrapper').hide();
    }
    else {
        $('#lost-conn').hide();
        $('#wrapper').show();
    }

    if( data.state == 'playing' && window.spinControl != 'spin' ) {
        window.fortunaNumber = data.ball;
        window.spinControl = "spin";
        $('#rotate-flag').val("spin");

        state = 'playing';

        $('#step span').removeClass('disact');
        $('#step span:nth-child(1)').addClass('disact');
    }

    if(data.state == 'betting') {
        //update round
        if(data.round != lastRound) {
            lastRound = data.round;
            $('#round .value').html(lastRound);
        }

        //update bets
        if(data.stakes) {
            globalBets = data.stakes;
            betsIsUpdated = true;
        }

        if(state == 'playing') {
            state = 'betting';
            globalBets = {};
            updateHistory();
        }

        $('#step span').removeClass('disact');
        $('#step span:nth-child(2)').addClass('disact');
    }
};

var isFirstCall = true;
fortunaUpdate = function() {
    ajaxCall("/fortuna_json?vsn=" + lastPacketVersion, function(err, data){
        console.log(data);
        switch (err) {
            case true:
                displayError();
                return retry(fortunaUpdate);
            default:
                setTimeout(function(){
                    updateScreen(data);

                    if(isFirstCall) {
                        isFirstCall = false;
                        updateHistory();
                    }
                }, 1);


                return retry(fortunaUpdate);
        }
    });

};
fortunaUpdate();

var numberColors = {
    0: 'green',
    26: 'black',
    35: 'black',
    28: 'black',
    29: 'black',
    22: 'black',
    31: 'black',
    20: 'black',
    33: 'black',
    24: 'black',
    10: 'black',
    8: 'black',
    11: 'black',
    13: 'black',
    6: 'black',
    17: 'black',
    2: 'black',
    4: 'black',
    15: 'black',

    3: 'red',
    12: 'red',
    7: 'red',
    18: 'red',
    9: 'red',
    14: 'red',
    1: 'red',
    16: 'red',
    5: 'red',
    23: 'red',
    30: 'red',
    36: 'red',
    27: 'red',
    34: 'red',
    25: 'red',
    21: 'red',
    19: 'red',
    32: 'red'
};


updateHistory = function(){
    $.ajax('/fortuna_history/?depth=120&round=' + lastRound, {
        type: "GET",
        dataType: "json",
        success: function(data) {
            var tableHistory = $('#new-history-tb');
            tableHistory.find('tr:not(.title)').remove();
            var cnt = 0;
            for(var i = data.data.length-1; cnt < 22 && cnt < data.data.length; i--) {
                var round = data.data[i];
                tableHistory.append('<tr><td>'+round.round+'</td><td class="h-'+numberColors[round.ball]+'">'+round.ball+'</td></tr>');
                cnt++;
            }


            //calculate statistics
            var tops = {};
            var rates = {};
            for(var i = 0; i < data.data.length; i++) {
                var round = data.data[i];
                round.ball = round.ball + '';
                if(rates[round.ball] != null) {
                    rates[round.ball] ++;
                }
                else {
                    rates[round.ball] = 1;
                }

                //last 50
                if ( i > data.data.length - 50) {
                    if(tops[round.ball] != null) {
                        tops[round.ball] ++;
                    }
                    else {
                        tops[round.ball] = 1;
                    }
                }

            }

            //tops correction
            for(i = 0; i <= 36; i++){
                if(typeof tops[i] == 'undefined') {
                    tops[i] = 0;
                }
            }




            //update statistics
            var table = $('#stats-tb');
            table.find('tr:not(.caption)').remove();

            for(i = 1; i <= 12; i++){
                var cnt1 = 0, cnt2 = 0, cnt3 = 0;
                var key1 = i, key2 = i+12, key3 = i+24;
                cnt1 = rates[key1] || 0;
                cnt2 = rates[key2] || 0;
                cnt3 = rates[key3] || 0;

                table.find('.separator').before('<tr></tr>');

                var tr = table.find('tr:not(.caption):last');
                tr.append('<td>'+key1+'</td><td>'+cnt1+'</td><td></td>');
                tr.append('<td>'+key2+'</td><td>'+cnt2+'</td><td></td>');
                tr.append('<td>'+key3+'</td><td>'+cnt3+'</td><td></td>');
            }

            var zeroCount = rates[0] || 0;
            $('.zero td:last', table).html(zeroCount);


            //update tops
            var sortableTops = [];
            for (var key in tops)
                sortableTops.push([key, tops[key]]);

            sortableTops = sortableTops.sort(function(a, b) {return a[1] - b[1]});
            //console.log(sortableTops);


            var top5 = sortableTops.slice(sortableTops.length-5, sortableTops.length).reverse(),
                bottom5 = sortableTops.slice(0, 5);

            var table = $('#mstats-tb');
            for(var i = 0; i < top5.length; i++){
                var ball = top5[i];
                $('.sector td:eq('+i+')', table).html(ball[0]);
                $('.rate td:eq('+i+')', table).html(ball[1]);
            }
            for(var i = 0; i < bottom5.length; i++){
                var ball = bottom5[i];
                $('.sector td:eq('+(i+5)+')', table).html(ball[0]);
                $('.rate td:eq('+(i+5)+')', table).html(ball[1]);
            }

        }
    });
};

updateTimer = function(tick){
    window.wheelTime = toTimer(tick);
    window.arcAngle = toRadians(tick);
};

var tick = 0;
setInterval(function(){
    tick++;
    updateTimer(tick);
}, 1000);