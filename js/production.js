var debug = true;
var tick = 0;
$(document).ready( function() {
    var spinControl = $('#rotate-flag');
    var print = function(str) {
        if (debug) {
            console.log(str);
        }
    };
    var toTimer = function(val) {
        var seconds = Math.round(val/1) % 60;
        if (seconds < 10) {
            return "0:0" + seconds;
        }
        return "0:" + seconds;
    };
    var toRadians = function(val) {
        var seconds = (val/1) % 60;
        return 2-2*(seconds/60);
    };



    /*
     var controlProvider = function() {
     tick++;
     //console.log("checking status: " + tick);
     window.wheelTime = toTimer(tick);
     window.arcAngle = toRadians(tick);

     window.fortunaNumber = 2;
     //console.log('fortuna number = ' + window.fortunaNumber);
     //$('#wheel-time').val(toTimer(tick));
     //$('#arc-angle').val(toRadians(tick));
     //console.log("Setting arc-angle to " + toRadians(tick));
     if (tick % 60*1 == 0) {
     spinControl.val("spin");
     window.spinControl = "spin";
     }
     setTimeout( controlProvider, 1000 );
     };
     controlProvider();
     */
});