//use angular 
var app = angular.module('demo', ['angular-progress-arc']);

app.controller('DemoCtrl', function ($scope) {
  //for tabs
  $scope.selected = "1";

  // Init progress value
  $scope.progress = 0;
  
  // Color hex values
  var orange = "#FF881E";
  var red = "#F5230D";
  var green = "#03B04C";
  
  // Breakpoints for colors
  var breakToWarning = 200;
  var breakToDanger = 250;
  
  // Color change
  $scope.$watch('progress', function(){
    if ($scope.progress >= breakToDanger) {
      $scope.barColor = red;
    } else if ($scope.progress < breakToDanger && $scope.progress > breakToWarning) {
      $scope.barColor = orange;
    } else if ($scope.progress < breakToWarning) {
      $scope.barColor = green;
    }
  });


  //set animate background
  window.onload = function() {

  window.requestAnimFrame = (function() {
      //browser animate
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        //set timeout
        function(callback) {
            window.setTimeout(callback, 1000);
        };
  })();
  //get element by canvas im html
  var C = document.getElementById("C");
  var context = C.getContext("2d");
  //number of stars
  var num = 1500; 
  //number of stars in circle
  var added_mass = 0;
  //circle radius
  var circleRadius = 2;
  //radius limit
  var radiusLimit = (C.width + C.height) / 20;
  //volume of circle
  var circleVolume = 0;
  //represents the constant of gravity in the system
  var G = 0.5; 
  // array of stars
  var R = [];
  console.log(R);
  var star = function(x, y, r, volume, color, angle, orbitRadius, angularSpeed, randomSpeed0, acceleration) {
    //propertys
    this.x = x;
    this.y = y;
    this.r = r;
    this.volume = volume;
    this.color = color;
    this.angle = angle;
    this.orbitRadius = orbitRadius;
    this.angularSpeed = angularSpeed;
    this.randomSpeed0 = randomSpeed0;
    this.acceleration = acceleration;
  };
  //init
  function init() {
    for (var i = 0; i < num; i++) {
      makeStar(0);
    }
  }
  //makestar
  function makeStar(new_star) {
    var x, y, r, volume, color, angle, orbitRadius, angularSpeed, randomSpeed0, acceleration;

    x = C.width ;
    y = C.height ;
    //radius
    r = Math.ceil(Math.random() * 2);
    // formula of sphere
    volume = (4 / 3) * Math.PI * Math.pow(r, 3);

    color = "rgba(255,255,255,1)";
    // set angle for stars, where their start animate
    angle = Math.random() * (2 * Math.PI);
    // set for center
    if (new_star == 0) {
      orbitRadius = (Math.random() * (C.width + C.height)) / 2;
    } 
    else {
      orbitRadius =
        Math.sqrt(Math.pow(C.width / 2 - C.width , 2) + Math.pow(C.height / 2 - C.height , 2) * 100);
    }
    //speed
    angularSpeed = Math.random() * (Math.PI / orbitRadius);
    randomSpeed0 = Math.random() * (Math.PI / orbitRadius);
    acceleration = 1;
    //push stars
    R.push(
      new star(x, y, r, volume, color, angle, orbitRadius, angularSpeed, randomSpeed0, acceleration)
    );
  }
  

  function setCanvasSize() {
    C.width = document.documentElement.clientWidth;
    C.height = document.documentElement.clientHeight;
    //whole radius of animation
    radiusLimit = (C.width + C.height) / 10;
  }

  function setMoveStar() {
    // add color after move of star
    context.fillStyle = "rgba(20,20,24,0.2)";
    context.fillRect(0, 0, C.width, C.height);
  }

  function drawCenter() {
    context.fillStyle = "rgb(0,0,0)";
    context.shadowColor = "rgba(255,255,255,"+ Math.random() / 2 +")";
    context.shadowBlur = circleRadius;
    //begin
    context.beginPath();
    //circle
    context.arc(C.width / 2, C.height / 2, circleRadius, 0, 2 * Math.PI);
    context.closePath();
    context.fill();

    context.shadowColor = "none";
    context.shadowBlur = 0;
    // increase circle
    if (circleRadius <= radiusLimit) {
      circleRadius = 1 * Math.sqrt(added_mass / Math.PI) + 10;
    }
  }

  function updateStar(i) {
    var star = R[i];

    star.x = C.width / 2 + Math.cos(star.angle) * star.orbitRadius;
    star.y = C.height / 2 + Math.sin(star.angle) * star.orbitRadius;
    //if not click, stars move to orbite
    if(!mousedown) {
      star.angle += star.angularSpeed;
    }
    //acceleration
    star.acceleration = G * (star.r * circleVolume) / Math.pow(star.orbitRadius, 2);
    // when near circle, change a color
    star.color = "rgba(255," + Math.round(star.orbitRadius) + "," + Math.round(star.orbitRadius) + ",1)";

    if (star.orbitRadius >= circleRadius) {
      star.orbitRadius -= star.acceleration;
    } 
    // else, move to the circle
    else {
      added_mass += star.r;

      R.splice(i, 1);
      makeStar(1);
      }
  }

  function isVisible(star) {
    if (
      star.x > C.width ||
      star.x + star.r < 0 ||
      star.y > C.height ||
      star.y + star.r < 0
    )
    return false;

    return true;
  }

  function drawStar(star) {
    context.fillStyle = star.color;
    //begin ath
    context.beginPath();
    context.fillRect(star.x, star.y, star.r, star.r);
    context.fill();
   }

  function loop() {
    setMoveStar();
    var star;

    circleVolume = (3 / 4) * Math.PI * Math.pow(circleRadius, 3);
    for (var i = 0; i < R.length; i++) {
    star = R[i];
      if (isVisible(star)) {
        drawStar(star);
      }
    updateStar(i);
    }

    drawCenter();
    requestAnimFrame(loop);
  }

  window.addEventListener("resize", function() {
    setCanvasSize();
  });
   
  var mousedown=false;
  window.addEventListener("mousedown",function(){
    mousedown=true;
  });
  window.addEventListener("mouseup",function(){
    mousedown=false;
  });

  setCanvasSize();
  setMoveStar();
  init();
  loop();
  }
});

//caman js
$(function() {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  //Enable Cross Origin Image Editing 
  var img = new Image();
  img.crossOrigin = '';
  //use random image
  img.src = 'https://unsplash.it/500/300?random';

  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0, img.width, img.height);
  }

  //first row buttons
  var $brightness = $('#brightnessbtn');
  var $noise = $('#noisebtn');
  var $sepia = $('#sepiabtn');
  var $contrast = $('#contrastbtn');
  var $color = $('#colorbtn');
  var $oldpaper = $('#oldpaperbtn');
  //second row buttons
  var $vintage = $('#vintagebtn');
  var $lomo = $('#lomobtn');
  var $emboss = $('#embossbtn');
  var $tiltshift = $('#tiltshiftbtn');
  var $radialblur = $('#radialblurbtn');
  var $edgeenhance = $('#edgeenhancebtn');
  //third row buttons
  var $posterize = $('#posterizebtn');
  var $clarity = $('#claritybtn');
  var $orangepeel = $('#orangepeelbtn');
  var $sincity = $('#sincitybtn');
  var $sunrise = $('#sunrisebtn');
  var $crossprocess = $('#crossprocessbtn');
  //fourth row buttons
  var $hazydays = $('#hazydaysbtn');
  var $love = $('#lovebtn');
  var $grungy = $('#grungybtn');
  var $jarques = $('#jarquesbtn');
  var $pinhole = $('#pinholebtn');
  var $oldboot = $('#oldbootbtn');
  var $glowingsun = $('#glowingsunbtn');
  //fifth row buttons
  var $reset = $('#resetbtn');
  var $save = $('#savebtn');

  // slider value changes
  $('input[type=range]').change(applyFilters);
  //four sliders
  function applyFilters() {
    var hue = parseInt($('#hue').val());
    var cntrst = parseInt($('#contrast').val());
    var vibr = parseInt($('#vibrance').val());
    var sep = parseInt($('#sepia').val());
    var gam = parseInt($('#gamma').val());
    var brig = parseInt($('#bright').val());
    var exp = parseInt($('#exposure').val());
    var shar = parseInt($('#sharpen').val());

    Caman('#canvas', img, function() {
      this.revert(false);
      this.hue(hue).contrast(cntrst).vibrance(vibr).sepia(sep).gamma(gam).brightness(brig).exposure(exp).sharpen(shar).render();
    });
  }

   // Creating custom filter for OldPaper
  Caman.Filter.register("oldpaper", function() {
    this.pinhole();
    this.noise(10);
    this.orangePeel();
    this.render();
  });

   // Filters button, Caman js
  $brightness.on('click', function(e) {
    Caman('#canvas', function() {
      this.brightness(30).render();
    });
  });

  $noise.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.noise(10).render();
    });
  });

  $contrast.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.contrast(10).render();
    });
  });

  $sepia.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.sepia(20).render();
    });
  });

  $color.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.colorize(60, 105, 218, 10).render();
    });
  });

  $vintage.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.vintage().render();
    });
  });

  $lomo.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.lomo().render();
    });
  });

  $emboss.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.emboss().render();
    });
  });

  $tiltshift.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.tiltShift({
        angle: 90,
        focusWidth: 300
      }).render();
    });
  });

  $radialblur.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.radialBlur().render();
    });
  });

  $edgeenhance.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.edgeEnhance().render();
    });
  });

  $posterize.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.posterize(8, 8).render();
    });
  });

  $clarity.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.clarity().render();
    });
  });

  $orangepeel.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.orangePeel().render();
    });
  });

  $sincity.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.sinCity().render();
    });
  });

  $sunrise.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.sunrise().render();
    });
  });

  $crossprocess.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.crossProcess().render();
    });
  });

  $love.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.love().render();
    });
  });

  $grungy.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.grungy().render();
    });
  });

  $jarques.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.jarques().render();
    });
  });

  $pinhole.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.pinhole().render();
    });
  });

  $oldboot.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.oldBoot().render();
    });
  });

  $glowingsun.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.glowingSun().render();
    });
  });

  $hazydays.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.hazyDays().render();
    });
  });


   // Custom filters OldPaper 
  $oldpaper.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.oldpaper();
      this.render();
    });
  });


  // You can also reset and save  it as a jpg image, extension need to be added later after saving image. 
  //reset
  $reset.on('click', function(e) {
    $('input[type=range]').val(0);
    Caman('#canvas', img, function() {
      this.revert(false);
      this.render();
    });
  });
  //save button
  $save.on('click', function(e) {
    Caman('#canvas', img, function() {
      this.render(function() {
        this.save('png');
      });
    });
  });
});