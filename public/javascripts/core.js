var SCROLLPOSITION = ($(this).scrollTop());
var BROWSER = detectBrowser();
var DB = {};
var UPL_SAFETY = 0;
var forms;

$(document).ready(function() {
	startT();
	submitRouter();
});

function startT(){
	bla();
	unitSlide();
	unitItemMask();
}

function startup(){
	buttonUnlock();
	submitRouter();
	radioButtons();
	uploadActivator();
	copyMe();
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



function uploadActivator(){
	
	$(".disabled").click(function(e){
		e.preventDefault();
	});
	
	$('#btnAlbSub').click(function() {
		var submitState = $('#uploadNav').children(".active").children("a").attr('href').replace("#ttab", "");
		var form = $("#ttab"+submitState);
		
		if(submitState == 1){//(submitState == 1 && UPL_SAFETY == 1){
			console.log("IF");
			console.log(submitState);
			console.log(UPL_SAFETY);
			
			changeTab(submitState);
		}
		else if(submitState == 2){
			forms = new Array();
			console.log("ELSE IF");
			form = $("#form_albumInfo");
			postSongUpl(form, function(response){
				if(response.nr == 0){
					
					changeTab(submitState);
					
				}
				else{
					alerta(form, response.nr, response.msg, response.obj);
				}
			
			});
		}
		else if(submitState == 3){
			forms = new Array();
			var counter = $("ol.sortable").children().length;
			orderForm();
			var Error = 0;
			for(var i = 1; i <= counter; i++){
				var form = $("#form_info_song_"+i);
				console.log("I : "+i);
				console.log("Counter : "+counter);
				postSongUpl(form, function(response){
					if(response.nr == 0){
						console.log("right");
						if(i == counter+1 && Error == 0){
							console.log("PENIS");
							$(".alert").remove();
							alerta($(".errorBox"), 0, response.msg);
							changeTab(submitState);
						}
					}
					else{
						console.log("wrong");
						Error = 1;
						if(i == counter+1){
							$(".alert").remove();
							alerta($(".errorBox"), 1, "you got error in "+forms.length+" upload Infos", forms);
							for(var j = 0; j < forms.length; j++){
								alerta(forms[j][0], forms[j][1], forms[j][2], forms[j][3]);
							}
						}
					}
				});	
			}
		}
		else{
			console.log("ELSE");
			alerta(form, 1, "Please upload album cover")
		}
	});
}

function changeTab(substate){

	substate++;
	
	var aElem = $('#uploadNav').find('[href="#ttab'+substate+'"]');  //"+submitState+"
	var liElem = aElem.parent();
	var tabElem = $('#ttab'+substate);
	var aListElem = $("#checkList").children("label").eq(substate-2).children();

	aListElem.removeClass("icon-remove");
	aListElem.addClass("icon-ok");
	liElem.removeClass("disabled");
	aElem.attr("data-toggle", "tab");
	aElem.tab('show');
	
}

function buttonUnlock(){
	var button = $("button.unlocker");
	
	button.click(function(){
		var t = $(this);
		toggle(t, function(){
			t.html("<i class='icon-ok'>");
			t.parent().children("[type!='button']").prop('disabled', false);
		}, function(){
			t.html("<i class='icon-remove'>");
			t.parent().children("[type!='button']").prop('disabled', true);
		});
	});
}



function copyMe(){
	var button = $("button.copy");
	$('.sortable').sortable();
	
	$("#ttab3").on("click", "button.delSong", function(){
		console.log("wtf");
		var liElem = $(this).parents("li");
		if(liElem.hasClass("copyMe")){
			var id = $(".errorBox")
			alerta(id ,1, "Can't delete first Song");
		}
		else{
			fadeIO(liElem);
			liElem.remove();
			ajaxPost(liElem.attr("id"), "/removeSong");
		}
	});
	
	button.click(function(){
		
		mp3_counter = ($("ol.sortable").children().length)+1;
		var content = $(".copyMe");
		var insert = content.parent();
		insert.append("<li id='Song_"+mp3_counter+"'>"+content.html()+"</li>");
		
		orderForm();
		
		
		$('.sortable').sortable().bind('sortupdate', function() {

			
		});
	});
}



function orderForm(){

	var liElem = $("ol.sortable").children();
	var leng = $("ol.sortable").children().length;
	
	for(var i=0; i < leng; i++){
		console.log("hiii"+i);
		var nuNr = i+1;
		console.log("Läng"+leng);
		
		var actElem = $(liElem[i]); 
		var songOpt = actElem.children(".collapse"); 
		var formSong = actElem.find("form.hidesrc"); 
		var formInfo = songOpt.find("form");
		var ctrGrp = formSong.parent();
		
		formInfo.attr("id","form_info_song_"+nuNr);
		formSong.attr("id","uploadWav_"+nuNr);
		formSong.attr("action","uploadWav/"+nuNr);
		ctrGrp.find("button[data-target*='#songOpt']").attr("data-target", "#songOpt_"+nuNr);
		songOpt.attr("id", "songOpt_"+nuNr);
		formInfo.children("input.hidden").attr("value", nuNr);
		
		if(!ctrGrp.hasClass("in") && !actElem.hasClass("copyMe")){
			ctrGrp.addClass("fade");
			window.setTimeout(function () {
				ctrGrp.addClass("in");
			}, 50);	
		}
		console.log("IIIII"+i);
	}
}

function insertVar(page, db){
	/*switch(uri){
		case "/upload":
			
			break;
	}*/
	var img = db[0];
	var obj = db[1];
	var artist = db[2];
	$.each( artist, function(aKey, aVal){
		artName = aVal[0]["artistName"];
		$("select.artist").append(
			$('<option></option>').val(artName).html(artName)
		);
	});
	
	$("#previewPic").attr("src","data:image/jpg;base64,"+img);
	$("#spanFileName").html("File Uploaded");
	$.each( obj, function(oKey, oVal){
		console.log(oKey+" - "+oVal);
		var form = $("form[id='form_"+oKey+"']");
		
		if(form.length){
			console.log("yes - "+oKey );
			console.log(form);
			
			$.each( obj[oKey], function(key, value){
				//console.log(key+" - "+value);
				console.log("PENIS : "+oKey);
				form.find("input[name='"+key+"']").val(value);
				form.find("select[name='"+key+"']").children("option[value='"+value+"']").attr("selected", "selected");
				form.find("[name='"+key+"']").parent().children("button.unlocker").trigger("click");

			});
		}
		
		else if(oKey == "songsInfo"){
			$.each( obj[oKey], function(key, value){
				console.log("HIER");
				console.log(key);
				var form = $("form[id='form_info_"+key+"']");
				if(!form.length){ $("button.copy").trigger("click"); form = $("form[id='form_info_"+key+"']");}
				$.each( obj[oKey][key], function(iKey, iVal){
					
					console.log("PIWIF: "+form.attr("id"));
					form.find("input[name='"+iKey+"']").val(iVal);
					form.find("select[name='"+iKey+"']").children("option[value='"+iVal+"']").attr("selected", "selected");
					form.find("[name='"+iKey+"']").parent().children("button.unlocker").trigger("click");
				});
			});
		}
	});
}

//// Lib ////
function toggle(toggler, functA, functB){
	if(toggler.hasClass("toggled")){
		functB();
		toggler.removeClass("toggled");
	}
	else{
		functA();
		toggler.addClass("toggled");
	}
}

function blink(elem){
	var preCol = elem.css("background-color");
	elem.animate(function(){
				backgroundColor: "green"
			},1000, function(){
				elem.animate(function(){
					backgroundColor: preCol
				},1000);
			});
}

function fadeIO(elem){
	if(elem.hasClass("in")){
		console.log("DEL");
		elem.removeClass("in");
	}
	else{
		elem.addClass("fade")
		window.setTimeout(function () {
			elem.addClass("in");
		}, 50);	
	}
}

