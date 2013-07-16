var SCROLLPOSITION = ($(this).scrollTop());
var BROWSER = detectBrowser();


$(document).ready(function() {
	startup();
	bla();
	unitSlide();
	unitItemMask();
});

function startup(){
	submitRouter();
	radioButtons();
}

function detectBrowser(){
	var isOpera = !!window.opera || navigator.userAgent.indexOf('Opera') >= 0;
	var isFirefox = typeof InstallTrigger !== 'undefined';
	var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
	var isChrome = !!window.chrome;
	var isIE = /*@cc_on!@*/false;

	if(isOpera){return "OP";}
	else if(isFirefox){return "FF";}
	else if(isSafari){return "SA";}
	else if(isChrome){return "CH";}
	else if(isIE){return "IE";}
	else{return "empty";}
}


///// index //////
function BgScroll(){
	$(window).scroll(function (){
		var Pika = (($(window).scrollTop()) + SCROLLPOSITION);
		Pika = (Pika/"4");
			var PP = -500;
			$('#wp_2').css("top", (PP+Pika) + 'px');
				PP = -1100;
			$('#wp_3').css("top", (PP+Pika) + 'px');
				PP = -1700;
			$('#wp_4').css("top", (PP+Pika) + 'px');
		
		/*
			var PP = -500;
			$("#wp_2").stop(false, true).animate({ "top" : (PP+Pika)}, 150);
			PP = -1100;
			$("#wp_3").stop(false, true).animate({ "top" : (PP+Pika)}, 150);
			PP = -1700;
			$("#wp_4").stop(false, true).animate({ "top" : (PP+Pika)}, 150);
		*/
			
				
			SCROLLPOSITION = ($(this).scrollTop());
	});
}

function smoothScroll(){
	
	$('a[href*=#s_]').bind("click", function(event) {
		//exept modals
		event.preventDefault();
		var obj = $(this).attr("href");
		obj = obj.substr(3, obj.length-3);
		
		
		var objDist = document.getElementById(obj).offsetTop;
		var objHeight = $("#"+obj).height();

		var scrollTime = objDist - Math.floor(objDist / 3);

		objDist -= (Math.floor($(window).height() / 2) - Math.floor(objHeight / 2));
		$('html,body').animate({
			scrollTop: objDist
		}, scrollTime , function (){/*location.hash = obj;*/});
	});
return false;
}


///// All Sites /////

function CloseAlbumCaroussel(){
	var navHeight = $("#unit").height() * -1;
	if($("#cWrap").css("top") == "0px"){
		console.log("if");
		console.log(navHeight);
		$("#cWrap").stop().animate({
			top: navHeight
		},600);
		$("#foldit").stop().animate({
			rotate: "180deg",
			top: 0
		},600);
		$("header").stop().animate({
			height: $("header").height() + navHeight
		},600);
	}
	else{
		console.log($("#cWrap").css("top"));
		$("#cWrap").stop().animate({
			top: 0
		},600);
		$("#foldit").stop().animate({
			rotate: "0deg",
			top: -20
		},600);
		$("header").stop().animate({
			height: $("header").height() - navHeight
		},600);
	}
}

function ShowUnitInformation() {
	$("a .unit-link").css("visibility: visible")
}


function locateSite(){
	var location = window.location.pathname;
	console.log(location);
	switch(location){
		case "/dashboard":
			$("#ulSideNav").children().removeClass("active");
			$("#liSiDash").addClass("active");
			break;
		case "/messages":
			$("#ulSideNav").children().removeClass("active");
			$("#liSiMess").addClass("active");
			break;
		case "/upload":
			$("#ulSideNav").children().removeClass("active");
			$("#liSiUpl").addClass("active");
			break;
		case "/settings":
			$("#ulSideNav").children().removeClass("active");
			$("#liSiSett").addClass("active");
			break;
		case "/statistic":
			$("#ulSideNav").children().removeClass("active");
			$("#liSiStat").addClass("active");
			break;
		case "/profil":
			$("#ulSideNav").children().removeClass("active");
			$("#liSiProf").addClass("active");
			break;
	}
	function switchActiveSite(){
			$("#ulSideNav").children().removeClass("active");
			$("#liSiMess").addClass("active");
	}
}

function selChange(){
	var selChange_rock = ['bla 1', 'bla 2'];
	selGenre = document.getElementById("selGenre")
	selGenre.onchange = function(){
		switch(selGenre.value){
			case "Rock":
				for(var i=0; i < selChange_rock.lenght; i++){
					opt = document.createElement('option')
						opt.text = selChange_rock[i];
						//.inject(selGenre)
						//.update(selGenre);
				}
				break;
		}
	}	
}

function unitSlide(){

	$(".unit-control").click(function(){
		var bDir = 1;
		var iUnitWidth = $(window).width(); // ??
		var iSelf = $("#ulUnit").offset().left;
		if($(this).hasClass('rasd')){
			bDir = -1;
			console.log("IFFF");
		}
		var move = (iUnitWidth/2 * bDir) + iSelf;
		if(bDir == 1 && move > 0){
			move = 0;
		}

		$("#ulUnit").stop().animate({
			left: move
		}, 1000);
		
		console.log(iSelf);
	});
}

function slide(dir){
		var slider = document.getElementById("ulUnit");
		var addIt = ($('#ulUnit').position().left + dir) + "px";
		slider.style.left = addIt;
		timer = setInterval("slide("+dir+")", 200);
}

function unitItemMask(){
	$(".unit-item").mouseover(function() {
		$(this).find("a").find("span").removeClass("hidden");
	}).mouseleave(function() {
		$(this).find("a").find("span").addClass("hidden");
	});
}

function uploadAlbumImg(){
	$(".fileUpload").click(function(e){
		e.preventDefault();
		console.log("JUFASDFJSF");
		//var reader = new FileReader();
	});
}

function radioButtons(){
  $('.ajaxGrp').each(function(){
    var group   = $(this);
    var form    = group.parents('form').eq(0);
    var name    = group.attr('data-toggle-name');
    var hidden  = $('input[name="' + name + '"]', form);
	var bool = true;
	
    $('button', group).each(function(){
      var button = $(this);
      button.on('click', function(){
		  bool ^= true;
          hidden.val($(this).val());
		  $('.toggleInput').prop('disabled', bool);
      });
      if(button.val() == hidden.val()) {
        button.addClass('active');
      }
    });
  });
}

