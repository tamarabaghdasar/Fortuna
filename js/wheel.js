var betsIsUpdated = false;
var globalBets = {};

var wheel = new Processing.Sketch();
wheel.imageCache.add("img/boundary.png");
wheel.imageCache.add("img/gradient__.png");
wheel.imageCache.add("img/arrow.png");
wheel.attachFunction = function(processing) {
    // Ð¾Ð±Ñ‰Ð¸Ðµ
    var elem;
    var wfont;
    var timerStr;
    var sound; // Ð¾Ð¿Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ð¹
    var state = 0; // 0/1
    var frames = 25;
    var canvasSize;
    var oX,oY; // Ñ†ÐµÐ½Ñ‚Ñ€ Ð²Ñ€Ð°Ñ‰ÐµÐ½Ð¸Ñ
    var diameter,radius;
    var bound,cgrad,mark; // Ð¸Ð·Ð¾Ð±Ñ€Ð°Ð¶ÐµÐ½Ð¸Ñ
    var tuneBound,tuneGrad;
    var centerSize; // Ð´Ð¸Ð°Ð¼ÐµÑ‚Ñ€ Ñ†ÐµÐ½Ñ‚Ñ€Ð°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ñ‚Ð°Ð±Ð»Ð¾
    var fontPXmain,tuneMainHor1sym,tuneMainHor2sym;
    var fontPXwin,tuneWinHor1sym,tuneWinHor2sym,tuneWinVert;
    var fontPXbet,bet1Lwidth;
    var tuneMark;
    var pweight;
    var numOfSeg = 37; // ÐºÐ¾Ð»Ð¸Ñ‡ÐµÑÑ‚Ð²Ð¾ ÑÐµÐ³Ð¼ÐµÐ½Ñ‚Ð¾Ð²
    var segRad; // Ñ€Ð°Ð·Ð¼ÐµÑ€ ÑÐµÐ³Ð¼ÐµÐ½Ñ‚Ð° Ð² Ñ€Ð°Ð´Ð¸Ð°Ð½Ð°Ñ…
    var segments = new Array(
        {'text':'0','fillColor':0xFF34AB34},
        {'text':'26','fillColor':0xFF2A2A2A},{'text':'3','fillColor':0xFFFF2D00},
        {'text':'35','fillColor':0xFF2A2A2A},{'text':'12','fillColor':0xFFFF2D00},
        {'text':'28','fillColor':0xFF2A2A2A},{'text':'7','fillColor':0xFFFF2D00},
        {'text':'29','fillColor':0xFF2A2A2A},{'text':'18','fillColor':0xFFFF2D00},
        {'text':'22','fillColor':0xFF2A2A2A},{'text':'9','fillColor':0xFFFF2D00},
        {'text':'31','fillColor':0xFF2A2A2A},{'text':'14','fillColor':0xFFFF2D00},
        {'text':'20','fillColor':0xFF2A2A2A},{'text':'1','fillColor':0xFFFF2D00},
        {'text':'33','fillColor':0xFF2A2A2A},{'text':'16','fillColor':0xFFFF2D00},
        {'text':'24','fillColor':0xFF2A2A2A},{'text':'5','fillColor':0xFFFF2D00},
        {'text':'10','fillColor':0xFF2A2A2A},{'text':'23','fillColor':0xFFFF2D00},
        {'text':'8','fillColor':0xFF2A2A2A},{'text':'30','fillColor':0xFFFF2D00},
        {'text':'11','fillColor':0xFF2A2A2A},{'text':'36','fillColor':0xFFFF2D00},
        {'text':'13','fillColor':0xFF2A2A2A},{'text':'27','fillColor':0xFFFF2D00},
        {'text':'6','fillColor':0xFF2A2A2A},{'text':'34','fillColor':0xFFFF2D00},
        {'text':'17','fillColor':0xFF2A2A2A},{'text':'25','fillColor':0xFFFF2D00},
        {'text':'2','fillColor':0xFF2A2A2A},{'text':'21','fillColor':0xFFFF2D00},
        {'text':'4','fillColor':0xFF2A2A2A},{'text':'19','fillColor':0xFFFF2D00},
        {'text':'15','fillColor':0xFF2A2A2A},{'text':'32','fillColor':0xFFFF2D00}
    );
    var bets = new Array();
    var prX1,prY1,prX2,prY2;
    var frameCount = 0;
    var hideBetsFlag = false;
    var markFlag = false;
    // ÐºÑ€Ð¸Ð²Ñ‹Ðµ
    var curveRM,curveSD; // Ð½Ð°ÑÑ‚Ñ€Ð¾ÐµÑ‡Ð½Ñ‹Ðµ ÐºÐ¾ÑÑ„. ÐºÑ€Ð¸Ð²Ñ‹Ñ…
    var curveKoef = new Array(0,0,1.6,1.260,1.145,1.090,1.065,1.050,1.038,1.030,1.025,1.020,1.018,1.016,1.015,1.012,1.010,1.009,1.008,1.007,1.005,1.005,1.003,1.003,1.003,1.003,1.003,1.003,1.002,1.002,1.002,1.002,1.002,1.002,1.002,1.002,1.002,1.002,1.002,1.002);
    // Ð²Ñ€Ð°Ñ‰ÐµÐ½Ð¸Ðµ
    var angleCurrent = 0;
    var angleDelta = 0;
    var maxSpeed = processing.PI / 16;//(processing.PI/16) * 16;
    var upTime = 1000; // Ð´Ð»Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾ÑÑ‚ÑŒ Ñ€Ð°Ð·Ð³Ð¾Ð½Ð° (ms)
    var downTime = 18000; // Ð´Ð»Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾ÑÑ‚ÑŒ Ð¾ÑÑ‚Ð°Ð½Ð¾Ð²ÐºÐ¸ (ms)
    var spinStart = 0;
    var duration,progress,finished;
    //
    var angleToNumber = function(angle) {
        var angle = angle % processing.TWO_PI;
        for (var i=1; i<38; i++) {
            var b1 = (processing.TWO_PI/37*36 + 1*processing.PI*3/2 + processing.TWO_PI/37*(i-1)) % processing.TWO_PI;
            var b2 = (processing.TWO_PI/37*36 + 1*processing.PI*3/2 + processing.TWO_PI/37*(i)) % processing.TWO_PI;
            if ( (angle > b1 && angle < b2) ) return i-1;
        }
        return 10;
    };

    var numberToAngle = function(number) {
        var segmentIndex = 0;
        for(var i = 0; i < segments.length; i++) {
            if (segments[i].text == number) {
                var random = processing.random(0.03, processing.TWO_PI/numOfSeg);
                return (random + processing.TWO_PI/37*36 + 1*processing.PI*3/2 + processing.TWO_PI/37*(i+1)) % processing.TWO_PI;
            }
        }
        return 0;
    };

    processing.setup = function() {
        elem = $('#wheel-canvas');
        canvasSize = elem.outerWidth();
        processing.size(canvasSize, canvasSize);
        processing.frameRate(frames );
        processing.stroke(0);
        processing.smooth();
        oX = canvasSize/2;
        oY = canvasSize/2 + canvasSize/100;
        diameter = 0.66*canvasSize;
        radius = diameter/2;
        segRad = processing.TWO_PI/numOfSeg;
        curveSD = processing.PI;
        if (numOfSeg >= 40) curveRM = 1.001;
        else curveRM = curveKoef[numOfSeg];
        angleCurrent = 0;//processing.random(0,processing.TWO_PI); // Ð½Ð°Ñ‡Ð°Ð»ÑŒÐ½Ð¾Ðµ Ð¿Ð¾Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ ÐºÐ¾Ð»ÐµÑÐ°
        //sound = document.createElement('audio');
        //sound.setAttribute('src', 'js/wheel.mp3');
        // Ð¸Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð¼Ð°ÑÑÐ¸Ð²Ð°
        var rLeft,rMiddle,rRight;
        for (var i = 0; i < numOfSeg; i++) {
            /* x1,x2,y1,y2 - ÐºÐ¾Ð¾Ñ€Ð´Ð¸Ð½Ð°Ñ‚Ñ‹ Ñ‚Ð¾Ñ‡ÐµÐº ÑÐµÐºÑ‚Ð¾Ñ€Ð° Ð½Ð° Ð¾ÐºÑ€ÑƒÐ¶Ð½Ð¾ÑÑ‚Ð¸; cX1,cX2,cY1,cY2 - ÐºÐ¾Ð¾Ñ€Ð´Ð¸Ð½Ð°Ñ‚Ñ‹ ÐºÐ¾Ð½Ñ‚Ñ€Ð¾Ð»ÑŒÐ½Ñ‹Ñ… Ñ‚Ð¾Ñ‡ÐµÐº ÐºÑ€Ð¸Ð²Ñ‹Ñ…; tX,tY - ÐºÐ¾Ð¾Ñ€Ð´Ð¸Ð½Ð°Ñ‚Ñ‹ Ð²Ñ‹Ð²Ð¾Ð´Ð° Ñ‚ÐµÐºÑÑ‚Ð° */
            rLeft = (numOfSeg - i)*segRad; rMiddle = (numOfSeg - i + 0.5)*segRad; rRight = (numOfSeg - i + 1)*segRad;
            segments[i].leftRad = rLeft;
            segments[i].middleRad = rMiddle;
            segments[i].rightRad = rRight;
            segments[i].x1 = radius*processing.cos(segments[i].leftRad);
            segments[i].x2 = radius*processing.cos(segments[i].rightRad);
            segments[i].y1 = radius*processing.sin(segments[i].leftRad);
            segments[i].y2 = radius*processing.sin(segments[i].rightRad);
            segments[i].cX1 = curveRM*radius*processing.cos(segments[i].leftRad + segRad/curveSD);
            segments[i].cX2 = curveRM*radius*processing.cos(segments[i].rightRad - segRad/curveSD);
            segments[i].cY1 = curveRM*radius*processing.sin(segments[i].leftRad + segRad/curveSD);
            segments[i].cY2 = curveRM*radius*processing.sin(segments[i].rightRad - segRad/curveSD);
            segments[i].tX = 0.89*radius*processing.cos(segments[i].middleRad);
            segments[i].tY = 0.89*radius*processing.sin(segments[i].middleRad);
        }
        bound = processing.loadImage("img/boundary.png");
        cgrad = processing.loadImage("img/gradient__.png");
        mark = processing.loadImage("img/arrow.png");
        tuneMark = radius/16;
        tuneBound = radius/45;
        tuneGrad = radius/5;
        centerSize = diameter/4;
        fontPXmain = radius/13;
        fontPXbet = radius/18;
        bet1Lwidth = 0.45*fontPXbet;
        wfont = processing.createFont("TexGyreBonum", fontPXmain, true);
        bfont = processing.createFont("Cuprum", fontPXbet, true);
        processing.textFont(wfont);
        tuneMainHor1sym = 2/3.2*fontPXmain;
        tuneMainHor2sym = 1/2.8*fontPXmain;
        fontPXwin = radius/5;
        tuneWinHor1sym = 2/6*fontPXwin;
        tuneWinHor2sym = 1/1.5*fontPXwin;
        tuneWinVert = fontPXwin/3;
        pweight = parseInt(radius/40);
        //
        processing.calcBets();
        processing.initBets();
        // Ð¿Ð¾Ð´Ð³Ð¾Ñ‚Ð¾Ð²ÐºÐ° Ð·Ð°Ð²ÐµÑ€ÑˆÐµÐ½Ð°
        lookAtMe();
    };

    processing.changeAppState = function(appstate) {
        if (appstate == 1) {
            window.spinControl = '0';
            processing.calcBets();
            processing.initBets();
            hideBetsFlag = false;
            state = 0;
            //$('#step span').removeClass('disact');
            //$('#step span:nth-child(2)').addClass('disact');
            setTimeout(function(){ markFlag = false }, 3000);
        }
        else if (appstate == 2) {
            window.spinControl = '1';
            bets.length = 0;
            markFlag = true;
            state = 1;
            //$('#step span').removeClass('disact');
            //$('#step span:nth-child(1)').addClass('disact');
        }
        return false;
    };

    processing.calcBets = function() {
        var x1,x2,y1,y2;
        for (var i = 0; i < numOfSeg; i++) {
            x1 = 0.999*radius*processing.cos(segments[i].middleRad);
            y1 = 0.999*radius*processing.sin(segments[i].middleRad);
            x2 = 1.05*radius*processing.cos(segments[i].middleRad);
            y2 = 1.05*radius*processing.sin(segments[i].middleRad);
            bets.push({'data':0,'opacity':0,'x1':x1,'y1':y1,'x2':x2,'y2':y2});
        }
    };

    // ÑÐ¼ÑƒÐ»ÑÑ†Ð¸Ñ ÑÑ‚Ð°Ð²Ð¾Ðº
    processing.initBets = function() {
        bets = wheel.initBets(bets, numOfSeg, segments, processing);
    };

    processing.updateBets = function() {
        bets = wheel.updateBets(bets, numOfSeg, segments, processing);
    };

    processing.drawBets = function() {
        if (markFlag === false) {
            processing.pushMatrix();
            processing.translate(0,0);
            processing.strokeCap(processing.ROUND);
            processing.textFont(bfont);
            processing.textSize(fontPXbet);
            var betLength,betOp;
            var needAngle = angleCurrent % processing.TWO_PI;
            for (var i = 0; i < numOfSeg; i++) {
                betLength = bets[parseInt(segments[i].text)].data.toString().length;
                if (bets[parseInt(segments[i].text)].data != 0) {
                    if (hideBetsFlag !== true) {
                        if (bets[parseInt(segments[i].text)].opacity < 1) {
                            bets[parseInt(segments[i].text)].opacity = bets[parseInt(segments[i].text)].opacity + 0.05;
                            betOp = bets[parseInt(segments[i].text)].opacity;
                        }
                        else betOp = 1;
                    }
                    else {
                        if (bets[parseInt(segments[i].text)].opacity > 0) {
                            bets[parseInt(segments[i].text)].opacity = bets[parseInt(segments[i].text)].opacity - 0.1;
                            betOp = bets[parseInt(segments[i].text)].opacity;
                        }
                        else betOp = 0;
                    }
                    processing.strokeWeight(parseInt(pweight/3));
                    processing.stroke(255,255,255,100*betOp);
                    processing.line(bets[i].x1,bets[i].y1,bets[i].x2,bets[i].y2);
                    processing.noFill();
                    processing.strokeWeight(parseInt(pweight/3));
                    processing.stroke(220,220,220,255*betOp);
                    processing.ellipse(1.009*bets[i].x2,1.009*bets[i].y2,parseInt(pweight/2),parseInt(pweight/2));
                    processing.pushMatrix();
                    processing.translate(1.08*bets[i].x2,1.08*bets[i].y2);
                    processing.rotate(-needAngle);
                    processing.noStroke();
                    processing.fill(0,0,0,100*betOp);
                    processing.rect(-bet1Lwidth*betLength/2 + bet1Lwidth*betLength/3*processing.cos(segments[i].middleRad + angleCurrent) - 0.7*bet1Lwidth, -fontPXbet/2 - 0.1*fontPXbet*processing.sin(segments[i].middleRad + angleCurrent) - bet1Lwidth/3, bet1Lwidth*betLength + 1.5*bet1Lwidth, fontPXbet + 0.6*bet1Lwidth, 3);
                    processing.fill(255,255,255,220*betOp);
                    processing.text(bets[parseInt(segments[i].text)].data,-bet1Lwidth*betLength/2 + bet1Lwidth*betLength/3*processing.cos(segments[i].middleRad + angleCurrent),fontPXbet/3 - 0.1*fontPXbet*processing.sin(segments[i].middleRad + angleCurrent));
                    processing.popMatrix();
                }
            }
            processing.popMatrix();
        }
    };

    var twinUp = [];
    var twinDown = [];
    upTime = 3000;
    downTime = 17000;
    maxSpeed = processing.PI / 16;


    processing.calculateTwin = function(){
        twinUp = [];
        twinDown = [];
        angleCurrent %= processing.TWO_PI;

        //angle to spin
        var ang = (processing.TWO_PI + numberToAngle(window.fortunaNumber) - angleCurrent) % processing.TWO_PI;
        //console.log('ang = ' + ang);
        //console.log('current = ' + angleCurrent);

        //spin-up
        var spinUpFrames = frames * upTime / 1000;
        var afterSpinUpPos = 0;
        for(var frame = 0; frame < spinUpFrames;  frame++){
            var duration = frame / spinUpFrames;
            var progress = duration / upTime;
            var angleDelta = maxSpeed * processing.sin(duration * processing.PI / 2);
            twinUp.push(angleDelta);
            afterSpinUpPos += angleDelta;
        }



        //spin-down
        var afterSpinDownPos = 0;
        var spinDownFrames = frames * downTime / 1000;
        for(frame = 0; frame < spinDownFrames;  frame++){
            duration = frame / spinDownFrames;
            progress = duration / downTime;
            angleDelta = maxSpeed * processing.sin(duration * processing.PI / 2 + processing.PI/2);
            twinDown.push(angleDelta);
            afterSpinDownPos += angleDelta;
        }

        //console.log('after spinDown = ' + (afterSpinUpPos + afterSpinDownPos) % processing.TWO_PI);

        var difference = ang - (afterSpinUpPos + afterSpinDownPos) % processing.TWO_PI;
        difference += processing.TWO_PI;
        var differenceStep = difference / twinDown.length;

        afterSpinDownPos = 0 ;
        for(var i = 0; i < twinDown.length; i++) {
            twinDown[i] += differenceStep;
        }


    };


    processing.draw = function() {
        processing.background(0,0);
        processing.translate(oX,oY);
        processing.strokeCap(processing.ROUND);
        // Ð²Ð½ÐµÑˆÐ½ÑÑ Ð³Ñ€Ð°Ð½Ð¸Ñ†Ð°
        processing.strokeWeight(4);
        processing.stroke(0,0,0,255);
        processing.ellipse(0,0,diameter,diameter);
        // Ð¾ÑÑ‚Ð°Ð»ÑŒÐ½Ð¾Ðµ
        processing.strokeWeight(1);
        processing.stroke(0,0,0,50);

        //console.log('spinControl = ' + window.spinControl + ' state = ' + state);

        if (window.spinControl == 'spin' && state == 0) {
            processing.calculateTwin();

            processing.changeAppState(2);
            //spinStart = new Date().getTime();
            //maxSpeed = processing.PI / (16 + processing.random(-3,3)); // Ð²Ð°Ñ€Ð¸Ð°Ñ†Ð¸Ñ Ð¼Ð°ÐºÑ.ÑÐºÐ¾Ñ€Ð¾ÑÑ‚Ð¸ Ñ€Ð°ÑÐºÑ€ÑƒÑ‚ÐºÐ¸
            //sound.play();

            progress = 0;
        }

        //all distance = 4 * maxSpeed / PI

        // ÑÑ‚Ñ€ÐµÐ»ÐºÐ°
        if (markFlag === true) processing.image(mark, 0 - tuneMark, -1.2*radius, 2*tuneMark, 2.05*tuneMark);
        processing.pushMatrix();

        if (state == 0) {processing.rotate(angleCurrent)}
        else if (state == 1) {
            finished = false;
            progress++;

            // up
            if(twinUp[progress]) {
                angleDelta = twinUp[progress];
            }
            else {
                if(twinDown[progress - twinUp.length + 1]) {
                    angleDelta = twinDown[progress - twinUp.length + 1];
                }
                else {
                    finished = true;
                }
            }



            angleCurrent += angleDelta;
            //angleCurrent = angleCurrent % processing.TWO_PI;
            //angleCurrent =  numberToAngle(window.fortunaNumber);
            //console.log('angle delta = ' + angleDelta + ' current = ' + angleCurrent, ' progress = ' + progress);
            if (finished) {
                processing.changeAppState(1);
                angleDelta = 0;
                //downTime = 18000 + processing.random(0,2000);
            }
            processing.rotate(angleCurrent);
        }

        for (var i = 0; i < numOfSeg; i++) {
            processing.fill(segments[i].fillColor);
            processing.beginShape();
            processing.vertex(0, 0);
            processing.vertex(segments[i].x1,segments[i].y1);
            processing.bezierVertex(segments[i].cX1,segments[i].cY1,segments[i].cX2,segments[i].cY2,segments[i].x2,segments[i].y2);
            processing.endShape(processing.CLOSE);
            processing.pushMatrix();

            // Ð²Ñ‹Ð²Ð¾Ð´ Ñ‚ÐµÐºÑÑ‚Ð°
            processing.translate(segments[i].tX,segments[i].tY);
            processing.rotate(segments[i].middleRad + processing.PI/2);
            if (segments[i].text.length > 1) {
                processing.fill(255,255,255,250);
                processing.text(segments[i].text, -tuneMainHor1sym, 0);
            }
            else {
                processing.fill(255,255,255,250);
                processing.text(segments[i].text, -tuneMainHor2sym, 0);
            }
            processing.popMatrix();
            // Ð¾Ñ„Ð¾Ñ€Ð¼Ð»ÐµÐ½Ð¸Ðµ Ð»Ð¸Ð½Ð¸Ð¹ Ð¼ÐµÐ¶Ð´Ñƒ ÑÐµÐºÑ‚Ð¾Ñ€Ð°Ð¼Ð¸
            processing.strokeWeight(5);
            if (segments[i].fillColor == 0xFF2A2A2A) processing.stroke(130,130,130,30);
            else processing.stroke(255,255,255,30);
            processing.line(0,0,segments[i].x1,segments[i].y1);
            // Ð²Ð¾ÑÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ
            processing.strokeWeight(1);
            processing.stroke(0,0,0,50);
        }

        // Ð·Ð²Ñ‘Ð·Ð´Ñ‹
        processing.image(cgrad, -radius + tuneGrad, -radius + tuneGrad, diameter - 2*tuneGrad, diameter - 2*tuneGrad);

        // Ð¾ÐºÐ°Ð½Ñ‚Ð¾Ð²ÐºÐ°
        processing.pushMatrix();
        processing.rotate(-angleCurrent);
        processing.image(bound, -radius - tuneBound, -radius - tuneBound, diameter + 2*tuneBound, diameter + 2*tuneBound);
        processing.popMatrix();
        if (state == 0) processing.drawBets();
        processing.popMatrix();

        //Ñ†ÐµÐ½Ñ‚Ñ€
        processing.strokeWeight(4);
        processing.fill(253,253,253,255);
        processing.stroke(0,0,0,40);
        processing.ellipse(0,0,centerSize,centerSize);
        processing.strokeWeight(2);
        processing.noFill();
        processing.stroke(0,0,0,150);
        processing.ellipse(0,0,centerSize - 2,centerSize - 2);
        processing.strokeWeight(1);
        processing.noFill();
        processing.stroke(0,0,0,100);
        processing.ellipse(0,0,centerSize - 6,centerSize - 6);

        // Ð²Ð½ÑƒÑ‚Ñ€ÐµÐ½Ð½Ð¾ÑÑ‚Ð¸
        processing.strokeCap(processing.SQUARE);
        processing.strokeWeight(pweight);
        processing.stroke(0,86,128,45);
        processing.ellipse(0,0,centerSize - 2.5*pweight,centerSize - 2.5*pweight);
        processing.strokeWeight(1);
        processing.stroke(0,86,128,20);
        processing.ellipse(0,0,centerSize - 2.5*pweight - 0.9*pweight,centerSize - 2.5*pweight - 0.9*pweight);
        processing.ellipse(0,0,centerSize - 2.5*pweight + 0.9*pweight,centerSize - 2.5*pweight + 0.9*pweight);
        processing.strokeWeight(pweight);
        processing.stroke(0,86,128,255);
        processing.arc(0,0,centerSize - 2.5*pweight,centerSize - 2.5*pweight,3/2*processing.PI,3/2*processing.PI + processing.PI * window.arcAngle);
        prX1 = ((centerSize - 2.5*pweight)/2 - pweight/2.1)*processing.cos(3/2*processing.PI + processing.PI * window.arcAngle);
        prY1 = ((centerSize - 2.5*pweight)/2 - pweight/2.1)*processing.sin(3/2*processing.PI + processing.PI * window.arcAngle);
        prX2 = ((centerSize - 2.5*pweight)/2 + pweight/2.1)*processing.cos(3/2*processing.PI + processing.PI * window.arcAngle);
        prY2 = ((centerSize - 2.5*pweight)/2 + pweight/2.1)*processing.sin(3/2*processing.PI + processing.PI * window.arcAngle);
        processing.strokeWeight(0.9*pweight);
        processing.line(prX1,prY1,prX2,prY2);
        processing.strokeWeight(parseInt(pweight/3));
        processing.stroke(255,255,0,255);
        processing.line(prX1,prY1,prX2,prY2);
        processing.textFont(wfont);
        processing.textSize(fontPXwin);
        processing.fill(0,0,0,220);

        if (segments[angleToNumber(angleCurrent)].text.length == 1)
            processing.text(segments[angleToNumber(angleCurrent)].text, -tuneWinHor1sym, tuneWinVert);
        else
            processing.text(segments[angleToNumber(angleCurrent)].text, -tuneWinHor2sym, tuneWinVert);

        // Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ð²Ð¾Ðº - Ñ€Ð°Ð· Ð² ÑÐµÐºÑƒÐ½Ð´Ñƒ
        if (state == 0) {
            //frameCount++;
            //if (frameCount > 50000) frameCount = 1;
            //if (frameCount % frames == 0) processing.updateBets();

            if(betsIsUpdated) {
                hideBetsFlag = false;
                //console.log('update bets, hideFlag = ' + hideBetsFlag);
                processing.updateBets();
                betsIsUpdated = false;
            }
        }
        if (state == 0 && window.arcAngle < processing.HALF_PI/(window.roundTime/2)) hideBetsFlag = true;

        // ÑÐ¼ÑƒÐ»ÑÑ†Ð¸Ñ Ð´Ð¾Ð±Ð°Ð²Ð»ÐµÐ½Ð¸Ñ ÑÑ‚Ð°Ð²Ð¾Ðº
        if (state == 0 && window.newElem == 1) {
            for (var i = 0; i < numOfSeg; i++) {
                if (bets[parseInt(segments[i].text)].data == 0) {
                    bets[parseInt(segments[i].text)].data = 100;
                }
            }
            window.newElem = 0;
        }

    }

};

wheel.initBets = function(bets, numOfSeg, segments, processing){
    var data = 0;
    for (var i = 0; i < numOfSeg; i++) {
        bets[parseInt(segments[i].text)].data = data;
    }

    return bets;
};

wheel.updateBets = function(bets, numOfSeg, segments, processing){
    if(jQuery.isEmptyObject(globalBets) ) {
        return bets;
    }

    for(var i in globalBets) {
        bets[i].data = number_format(globalBets[i], 2);
    }
    return bets;
};
