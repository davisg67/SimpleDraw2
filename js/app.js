/**********************************************************
Date Created: 7-26-2015

Description: An example of using HTML5's Canvas element to 
make a simple drawing application.

This project came from teamtreehouse.com as a JQuery project
that demonstrated the Canva element. I then extended the project
to include a more sophisicated color picker plugin, a remove
color feature, erase canvas feature and my own responsive page 
layout for practice.

Revised to version 2.0: 8-23-2015
Added several new tools with icons and a slideout menu system.
In addition to pen there is now a line tool, spray paint, eraser,
and shapes. Line width can be adjusted. Increased canvas size to 
full screen width. Responsive layout.

************************************************************/


$("document").ready( function () {
    //Init Select elements.
    $("#shapes select").val("none");
    $("#toolWidth select").val("1");
    
    //Main canvas
    var $canvas = $("#drawSpace"); //Reference
    var context = $canvas[0].getContext("2d"); //Context

    //Temp Canvas
    var $tmpCanvas = $("#tmpdrawSpace"); //Reference
    var tmpContext = $tmpCanvas[0].getContext("2d"); //Context
    tmpContext.globalCompositeOperation = "source-over"; 

    var lastEvent;
    var mouseDown = false;

    var tool = {
       selectedTool: "pen",   
       toolWidth: 1,
       color: $(".selected").css("background-color"),
       startX: 0,
       startY: 0
    };

    //Alternate title colors randomly every second.
    window.setInterval(function() {
        jumbleTitleColors();
    }, 1000);


    /************* Responsive Canvas ********************************/
    /* Source - http://ameijer.nl/2011/08/resizable-html5-canvas/ */


    function respondCanvas() { 
        var container = $($canvas).parent();

        $canvas.attr('width', $(container).width() ); //max width
        $canvas.attr('height', $(container).height() ); //max height

        $tmpCanvas.attr('width', $(container).width() ); //max width
        $tmpCanvas.attr('height', $(container).height() ); //max height
    }

    function canvasWidth() {
       var container = $($canvas).parent();  
       return $(container).width(); 
    }

    function canvasHeight() {
       var container = $($canvas).parent();  
       return $(container).height();
    }

    //Initial call 
    respondCanvas();
    /*******************************************************************/


    //Run function when browser resizes
    $(window).resize( respondCanvas );


    //Line width tool change
    $("#toolWidth").change(function () {
        tool.toolWidth = $("#toolWidth option:selected").val();
    });

    //Shapes 
    $("#shapes").change(function () {
        tool.selectedTool = $("#shapes option:selected").val();
    });



    //*************** Animated Title Colors ******************

    //Return a random color for every letter in the title.
    function jumbleTitleColors() {
        $("#title h1").children().removeClass();
        var id;
        for (var i=1; i <= 10; i++) {
            id = "#char" + i.toString();
            $(id).addClass(returnRandomColorClass());
        }
    }

    //Returns a random color class from six possible colors.
    function returnRandomColorClass() {
        var color;
        var randomNumber = Math.floor( Math.random() * 6) + 1;
        switch(randomNumber) {
            case 1:
                color = "Red";
                break;
            case 2:
                color = "orange";
                break;
            case 3:
                color = "Yellow";
                break;
            case 4:
                color = "cyan";
                break;
            case 5:
                //No class returned.
                break;
            case 6:
                color = "Blue";
                break;
            default:
                //No class returned.
        }

        return color;  //Name of the color class.
    }

    //********************************************************************

    
    //Slide out menu trigger
    $("#navIcon").click(function () {
         if ($("body").hasClass("menu-active")) {
            $("body").removeClass("menu-active");
        } else {
            $("body").addClass("menu-active");    
        }
    });


    //**************** Update Current Tool Selection ********************
    $("#pen").click(function () {
        $("#shapes").removeClass("selectedTool");
        $("#tools").children().removeClass("selectedTool");
        $("#pen").addClass("selectedTool");
        tool.selectedTool = "pen"; 
         $("#tmpdrawSpace").css("cursor", "url(images/cursor.png), crosshair");
    });

    $("#line").click(function () {
        $("#shapes").removeClass("selectedTool");
        $("#tools").children().removeClass("selectedTool");
        $("#line").addClass("selectedTool"); 
        tool.selectedTool = "line";  
         $("#tmpdrawSpace").css("cursor", "url(images/cursor.png), crosshair");
    });

    $("#sprayPaint").click(function () {
        $("#shapes").removeClass("selectedTool");
        $("#tools").children().removeClass("selectedTool");
        $("#sprayPaint").addClass("selectedTool");
        tool.selectedTool = "spray";  
        $("#tmpdrawSpace").css("cursor", "url(images/spraycan.cur), crosshair");
    });

    $("#eraser").click(function () {
        $("#shapes").removeClass("selectedTool");
        $("#tools").children().removeClass("selectedTool");
        $("#eraser").addClass("selectedTool");
        tool.selectedTool = "eraser";  
        $("#tmpdrawSpace").css("cursor", "url(images/eraser.cur), crosshair");
    });


    $("#shapes").click(function () {
        $("#tools").children().removeClass("selectedTool");
        $("#shapes").addClass("selectedTool");
        tool.selectedTool = $("#shapes option:selected").val();
        $("#tmpdrawSpace").css("cursor", "url(images/cursor.png), crosshair");
    });
    //**************************************************************************




    //****************** Update Color Selection ********************************
    $("#selectedColors").on("click", "li", function(){
        //Deselect sibling elements
        $(this).siblings().removeClass("selected");

        //Select clicked element
        $(this).addClass("selected"); 

        //cache current color
        tool.color = $(this).css("background-color");
    });


    //Display RGB Value on color well hover event.
    $( "#selectedColors li" ).hover(function() {
        var rgbValue = $(this).css("background-color");
        if ($(this).hasClass("noColorDefault")) {
            $(this).prop('title', "No Color");
        } else {
            $(this).prop('title', rgbValue);    
        }
    });



    //Clear the canvas when New is selected from tool bar.
    $("#new").click(function () {
        context.clearRect(0, 0, canvasWidth(), canvasHeight()); 
        tmpContext.clearRect(0, 0, canvasWidth(), canvasHeight()); 
    });

    //Save drawing to an image file
    $("#save").click(function () {
       //Get the base64 data url for canvas
        var dataURL = document.getElementById("drawSpace").toDataURL("image/png");
        var imga = document.createElement("a");
        imga.href = dataURL;
        imga.target = "_blank";
        imga.download = "myImage.png";
        document.body.appendChild(imga);
        imga.click();  
    });



    //*********************** ColorPicker Plugin ******************
    //Source:  http://www.eyecon.ro/colorpicker/
    $("#editMode").ColorPicker({
        color: tool.color,

        onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
        },
        onChange: function (hsb, hex, rgb) {
            var value = '#' + hex;
            $("#selectedColors li.selected").css('background-color', value); 

            //$('#newColor').css('background-color', '#' + hex); 
        }
    });
    

    $("#resetColors").click(function () {
        $("#selectedColors li.redDefault").css('background-color', '#FF0000'); 
        $("#selectedColors li.blueDefault").css('background-color', '#0000FF'); 
        $("#selectedColors li.yellowDefault").css('background-color', '#FFFF00'); 
        $("#selectedColors li.blackDefault").css('background-color', '#000000');
        $("#selectedColors li.brownDefault").css('background-color', '#A52A2A');
        $("#selectedColors li.greenDefault").css('background-color', '#008000');
        $("#selectedColors li.orangeDefault").css('background-color', '#FFA500');
        $("#selectedColors li.purpleDefault").css('background-color', '#800080');
        tool.color = $("#selectedColors li.selected").css("background-color");
    });
    
    
    //Toggle the display of the header section.
    $("#titleDisplay").click(function () {
        if ($( "#header" ).is( ":hidden" )) {
           $("#header").slideDown(); 
        } else {
           $("#header").slideUp(); 
        }
        
        //Arrow icons
        $("#showTitle").toggle();
        $("#hideTitle").toggle();
    });



    //********************* CANVAS OPERATION ******************************

    //Send temporary canvas image to main canvas then clear the temp canvas.
    function updateImg() {
        context.drawImage($tmpCanvas[0], 0, 0); 
        tmpContext.clearRect(0, 0, canvasWidth(), canvasHeight());
    }


    /*********************************************************************
      Thank you Rishabh, Trig is not really my thing.
      http://codetheory.in/different-tools-for-our-sketching-application/

      Generate random x/y offsets in circular area from center point. 
    ************************************************************************/
    function getRandomOffset(radius) {
        var random_angle = Math.random() * (2*Math.PI);
        var random_radius = Math.random() * radius;

        return {
            x: Math.cos(random_angle) * random_radius,
            y: Math.sin(random_angle) * random_radius
        };
    }

    function generateSpray(density, xpos, ypos) {
        var offset = 0;
        var x = 0;
        var y = 0;

        for (var i = 0; i < density; i++) {
            offset = getRandomOffset(10);
            x = xpos + offset.x;
            y = ypos + offset.y;
            tmpContext.fillRect(x, y, 1, 1);
        }        
    }

    function updateMousePosition(e) {
        var xpos;
        var ypos;

        if(e.offsetX==undefined) {
          return {
            x: xpos = e.pageX-$tmpCanvas.offset().left,
            y: ypos = e.pageY-$tmpCanvas.offset().top 
          };
        } else {
           return {
             x: xpos = e.offsetX,
             y: ypos = e.offsetY
           }
        }    
    }

    function drawRectangle(mouse) {
        var x = 0;
        var y = 0;
        var width = 0;
        var height = 0;

        tmpContext.clearRect(0, 0, canvasWidth(), canvasHeight());
        x = Math.min(mouse.x, tool.startX);
        y = Math.min(mouse.y, tool.startY);
        width = Math.abs(mouse.x - tool.startX);
        height = Math.abs(mouse.y - tool.startY);
        tmpContext.strokeRect(x, y, width, height);
    }

    function drawCircle(mouse) {
       var x = 0;
       var y = 0;
       var radius = 0;

       tmpContext.clearRect(0, 0, canvasWidth(), canvasHeight());

        x = (mouse.x + tool.startX) / 2;
        y = (mouse.y + tool.startY) / 2;

        radius = Math.max(
                Math.abs(mouse.x - tool.startX),
                Math.abs(mouse.y - tool.startY)
        ) / 2;

        tmpContext.beginPath();
        tmpContext.arc(x, y, radius, 0, Math.PI*2, false);
        // tmp_ctx.arc(x, y, 5, 0, Math.PI*2, false);
        tmpContext.stroke();
        tmpContext.closePath();

    }


    function drawEllipse(ctx, x, y, w, h) {
      var kappa = .5522848;
      tmpContext.clearRect(0, 0, canvasWidth(), canvasHeight());

          ox = (w / 2) * kappa, // control point offset horizontal
          oy = (h / 2) * kappa, // control point offset vertical
          xe = x + w,           // x-end
          ye = y + h,           // y-end
          xm = x + w / 2,       // x-middle
          ym = y + h / 2;       // y-middle

      ctx.beginPath();
      ctx.moveTo(x, ym);
      ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
      ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
      ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
      ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
      ctx.closePath();
      ctx.stroke();
    }




    //*** Mouse Events on Canvas ****
    $tmpCanvas.mousedown(function(e){
      lastEvent = e; //Store last event.

      tool.startX = lastEvent.offsetX; //Used for line to sore start point.
      tool.startY = lastEvent.offsetY;

      tmpContext.lineWidth = tool.toolWidth;
      tmpContext.strokeStyle = tool.color;  //color, gradient, or pattern used.
      tmpContext.fillStyle = tool.color;
      //context.fillStyle = tool.color;
      mouseDown = true;
      //context.save();
    }).mousemove(function(e){
      //Only valid while mouse button is held down.
      if(mouseDown) {
        tmpContext.beginPath();  
        var mouse = updateMousePosition(e);

        switch(tool.selectedTool) {
            case "pen":
                tmpContext.moveTo(lastEvent.offsetX, lastEvent.offsetY); 
                //tmpContext.lineTo(e.offsetX, e.offsetY); 
                tmpContext.lineTo(mouse.x, mouse.y); 
                tmpContext.stroke(); 
            break;
            case "line":
                tmpContext.clearRect(0, 0, canvasWidth(), canvasHeight());
                tmpContext.moveTo(tool.startX, tool.startY); 
                //tmpContext.lineTo(e.offsetX, e.offsetY); 
                tmpContext.lineTo(mouse.x, mouse.y); 
                tmpContext.stroke(); 
            break;
            case "spray":
                generateSpray(55, mouse.x, mouse.y);   
            break;  
            case "eraser":
                tmpContext.lineWidth = 10;
                tmpContext.strokeStyle = "#fff"; 
                tmpContext.fillStyle = "#fff";
                tmpContext.moveTo(lastEvent.offsetX, lastEvent.offsetY); 
                tmpContext.lineTo(mouse.x, mouse.y); 
                tmpContext.stroke();
            break;
            case "rectangle":
                drawRectangle(mouse);
            break;
            case "circle":
                drawCircle(mouse);
            break;
            case "oval":
                drawEllipse(tmpContext, mouse.x, mouse.y, (mouse.x-tool.startX), (mouse.y - tool.startY))
            break;
    }   

        lastEvent = e;
      }
    }).mouseup(function(e){
        mouseDown = false;
        //context.restore();
        updateImg();

    }).mouseleave(function(){
      $tmpCanvas.mouseup();
    });

    //***************************************************************************

});
  







