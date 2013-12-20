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
	slideIcons();
	PPFix();
	radioButtons();
}

function startup(){
	activeField();
	buttonUnlock();
	submitRouter();
	radioButtons();
	uploadActivator();
	copyMe();
	clickableTables();
	songInit();
	PPFix();
	declineAlb();
	aUsers();
	aDelHelp();
	changeGenre();
	multiplicable();
	checkSongRdy();
	tooltips();
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
		}
		var move = (iUnitWidth/2 * bDir) + iSelf;
		if(bDir == 1 && move > 0){
			move = 0;
		}

		$("#ulUnit").stop().animate({
			left: move
		}, 1000);
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
		  if(button.val()){
		  	if(button.val() == 1){bool = false;}
		  	else{ bool = true;}
		  }
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
		
		if(submitState == 1 && UPL_SAFETY == 1){
			changeTab(submitState);
		}
		else if(submitState == 2){
			forms = new Array();
			form = $("#form_albumInfo");
			postSongUpl(form, function(response){
				if(response.nr == 0){
					alerta(form, response.nr, response.msg, response.obj);
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
			var sCount = 0;
			for(var i = 1; i <= counter; i++){
				var form = $("#form_info_song_"+i);
				postSongUpl(form, function(response){
					if(response.nr == 0){
						sCount++;
						if(sCount == counter && Error == 0){
							$(".alert").remove();
							alerta($(".errorBox"), 0, response.msg);
							changeTab(submitState);
							calcPrice();
						}
					}
					else{
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
		else if(submitState == 4){
			var forma = $("#form_paymentMethod");
			postSongUpl(forma, function(response){
				if(response.nr == 0){
					changeTab(submitState);
				}
				else{
					alerta(form, response.nr, response.msg, response.obj);
				}
			});
		}
		else{
			alerta(form, 1, "Please upload album cover")
		}
	});
}

function changeTab(substate){
	setTimeout(function(){
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
	},500);
	
}

function calcPrice(){
	ajaxPost(0, "calcPrice", function(res){

		var table = $("#priceTable");
		var waiter = $("#waiter");

		var array = new Array(3);
			array[0] = new Array(3);
			array[1] = new Array(3);
			array[2] = new Array(3);
			array[0][0] = res.songs;
			array[0][1] = res.pSong;
			array[0][2] = array[0][0] * array[0][1];
			array[1][0] = res.songs;
			array[1][1] = res. pISRC;
			array[1][2] = array[1][0] * array[1][1];
			array[2][0] = res.ean;
			array[2][1] = res.pEAN;
			array[2][2] = array[2][0] * array[2][1];
		var total = 0;
		for(var i=0; i < array.length; i++){
			total += array[i][2];
			for(var j=0; j < array[i].length; j++){
				
				if(j == 0){
					table.find("#pay_"+i+j).html(array[i][j]);
				}
				else{
					table.find("#pay_"+i+j).html(array[i][j]+" &euro;");
				}
			}
		}

		table.find("#pay_3").html(total+" &euro;");

		waiter.removeClass("in");
		table.removeClass("hide");
		table.addClass("in");
	});
}

function buttonUnlock(){

	$("#Content").on("click", "button.unlocker", function(){
		var t = $(this);

		toggle(t, function(){
			t.html("<i class='icon-ok'>");
			t.parent().children("[type!='button']").prop('disabled', false);
		}, function(){
			t.html("<i class='icon-remove'>");
			t.parent().children("[type!='button']").prop('disabled', true);
		});
		checkSongRdy2(this);
	});
}

function copyMe(){
	var button = $("button.copy");
	$('.sortable').sortable({ handle: '.handle', placeholder: "ui-state-highlight", stop: function(event, ui){
		orderForm();
	}});
	
	$("#ttab3").on("click", "button.delSong", function(){
		var liElem = $(this).parents("li");
			fadeIO(liElem);
			liElem.remove();

		var give = {
			sNr: liElem.find("input[name='hiddenNr']").val()
			,sId: liElem.find("input[name='songId']").val()
		};

		ajaxPost(give, "/removeSong"); // HIER GIVE SCHICKEN
	});

	$("#ttab3").on("keyup", "input[name='trackTitle']", function(){
		var spanFileName = $(this).parents("li").find("#spanFileName");
		var name = $(this).val();
		var len = name.length;
		if(len > 21){
			name = name.substring(0,10)+"..."+name.substring(len-10, len);
		}
			spanFileName.html(name);
		
	});
	
	button.click(function(){
		
		
		var content = $("#songEx");
		var insert = $("ol.sortable");
		var mp3_counter = insert.children().length;
		insert.append("<li class='fade' id='Song_"+mp3_counter+"'>"+content.html()+"</li>");
		var actEl = insert.children('#Song_'+mp3_counter);
		orderForm(actEl);
		radioGrp();
		tooltips();
		window.setTimeout(function () {
			actEl.addClass("in");
		}, 50);	
	});
}



function orderForm(){

	var liElem = $("ol.sortable").children();
	var leng = liElem.length;
	
	for(var i=0; i < leng; i++){
		var nuNr = i+1;
		
		var actElem = $(liElem[i]); 
		var songOpt = actElem.children(".collapse");
		var formSong = actElem.find("form.hidesrc"); 
		var formInfo = songOpt.find("form");
		var ctrGrp = formSong.parent();

		var trackNr = formInfo.find("input[name='trackNr']");
		var volNr = formInfo.find("input[name='volumeNr']");
		
		actElem.attr("id", "Song_"+nuNr);
		formInfo.attr("id","form_info_song_"+nuNr);
		formSong.attr("id","uploadWav_"+nuNr);
		ctrGrp.find("button[data-target*='#songOpt']").attr("data-target", "#songOpt_"+nuNr);
		songOpt.attr("id", "songOpt_"+nuNr);
		formInfo.children("input[name='hiddenNr']").attr("value", nuNr);
		songOpt.find("[id*='addOpt_']").attr("id", "addOpt_"+nuNr); //extra opt div
		songOpt.find("button[data-target*='#addOpt_']").attr("data-target", "#addOpt_"+nuNr); //extra opt btn
		volNr.val("1");
		trackNr.val(nuNr);
	}
}

function insertVar(page, db){
	/*switch(uri){
		case "/upload":
			
			break;
	}*/
	var html = $("#email").html();
	html.replace(/\?.*/,' '); /// HIER IWIE AT RAUSKRIEGEN
	$("#form_paymentMethod").find(".betreff").html(html);
	

	
	var img = db[0];
	var obj = db[1];
	var artist = db[2];
	if(artist){
		$.each( artist, function(aKey, aVal){
			artName = aVal["artistName"];
			$("select.artist").append($('<option></option>').val(artName).html(artName));
		});
	}

	if(obj.albumInfo){
		var id1 = "#opt"+obj.albumInfo.kategorie1;
		var id2 = "#opt"+obj.albumInfo.kategorie2;
		var html1 = $(id1).html();
		var html2 = $(id2).html();
		$("textarea[name='promotext']").val(obj.albumInfo.promotext);
		$("select[name='subgenre']").html(html1);
		$("select[name='genre']").html(html2);
	}
	if(img){ UPL_SAFETY = 1; };
	$("#previewPic").attr("src","data:image/jpg;base64,"+img);
	$("#spanFileName").html("File Uploaded");
	$.each( obj, function(oKey, oVal){
		var form = $("form[id='form_"+oKey+"']");
		
		if(oKey == "albumInfo"){
			
			$.each( obj[oKey], function(key, value){
				var inp = form.find("input[name='"+key+"']");
				inp.val(value);
				inp.parent(".datepicker").attr('data-date', value);
				form.find("select[name='"+key+"']").val(value).attr('selected',true);
				form.find("[name='"+key+"']").parent().children("button.unlocker").trigger("click");


			});
		}
		
		else if(oKey == "songsInfo"){
			var len = Object.keys(obj[oKey]).length;
			console.log(obj[oKey]);
			console.log(len);
			for(var i=0; i<len; i++){
				$("button.copy").trigger("click");
			}
			$.each( obj[oKey], function(key, value){
				var form = $("form[id='form_info_"+key+"']");
				console.log("********************************");
				console.log(oKey+"   "+key);
				form = $("form[id='form_info_"+key+"']");
				li = form.parents("li");
				li.find("#spanFileName").html(obj[oKey][key]["trackTitle"]);
				li.find("#spanNrCount").css("background-color", "#5EFF29").css("border-color", "#5EFF29");


				for(var i = 1; i<10; i++){
					var aComp = "kompName_"+i;
					if(obj[oKey][key][aComp]){
						li.find("[name='kompName_']").parents(".control-group").children("button").trigger("click");
					}
				}
				for(var i = 1; i<10; i++){
					var aText = "textAuth_"+i;
					if(obj[oKey][key][aText]){
						li.find("[name='textAuth_']").parents(".control-group").children("button").trigger("click");
					}
				}


				$.each( obj[oKey][key], function(iKey, iVal){
					var inp = form.find("input[name='"+iKey+"']");
					inp.val(iVal);

					var radGrp = inp.parent().children(".radioGrp");
					radGrp.children(".active").removeClass("active");
					radGrp.children("button[value='"+iVal+"']").addClass("active");
					
					
					form.find("select[name='"+iKey+"']").children("option[value='"+iVal+"']").attr("selected", "selected");
					form.find("[name='"+iKey+"']").parent().children("button.unlocker").trigger("click");

				});
			});
		}
	});
	$('#dp1').datepicker({ format: "yyyy-mm-dd" });
	$('#dp2').datepicker({ format: "yyyy-mm-dd" });
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
		elem.removeClass("in");
	}
	else{
		elem.addClass("fade")
		window.setTimeout(function () {
			elem.addClass("in");
		}, 50);	
	}
}

function addOpt(){
	/*
	$("select.artist").append(
			$('<option></option>').val(artName).html(artName);
		);
	*/
}

function toPaypal(){
	ajaxPost(false, "paypal", function(stuff){
		window.open (stuff,'_self',false)
	});
	
}

function clickableTables(){
	$("table.table-hover").on("click", "tr.album", function(){
		
	});
}

function slideIcons(){
	$(".ico").css("backgroundPosition","0px 0px")
		.mouseover(function(){
			$(this).stop().animate({
				"backgroundPosition":"0px -23px"
			},1000)
		})
		.mouseout(function(){
			$(this).stop().animate({
				backgroundPositionY:"0px"
			},1000);
		});
}

function activeField(){
	$("a[href='#artistModal']").click(function(){
		$(".activeField").removeClass("activeField");
		$(this).parent().children("select").addClass("activeField");
	});
}

function PPFix(){
	$('#paypalModal').on('hide', function () {
		window.location.pathname = "/";
	});
}

function aDelHelp(){
	var delNews = $("a[href='#delNewsModal']");
	delNews.click(function(){
		var asd = "delNews/" + delNews.attr("id");
		$("#delNewsModal").children("form").attr( 'action', asd );

	})
}

function radioGrp(){
	$(".radioGrp").on("click", function(event){
		var el = event.target;
		var value = el.value;
		$(el).parent().parent().children('input[type="hidden"]').val(value);
	});
}

function aUsers(){
	$("a.editUser").on("click", function(event){
		var mod = $("#editUserModal");
		var mods = mod.children("form");
		var row = $(event.target).parents("tr").children();
		var mail = row.eq(1).html();
		var state = row.eq(2).html();
		var state = state.substring(0, state.length -1);
		var mail = mail.substring(0, mail.length -1);
		mods.children(".modal-header").children("h3").html("Edit User - "+ mail);
		mods.children(".modal-body").find("select").val(state).attr('selected',true);
		mods.children(".modal-body").find("[name='email']").val(mail);
		mods.children(".modal-body").find("[name='email_sav']").val(mail);

		mod.modal('show');
	});
	$("a.writeMessage").on("click", function(event){
		var mod = $("#writeMessageModal");
		var mods = mod.children("form");
		var row = $(event.target).parents("tr").children();
		var mail = row.eq(1).html();
		var mail = mail.substring(0, mail.length -1);
		mods.children(".modal-header").children("h3").html("Message User - "+ mail);
		mods.children(".modal-body").find("[name='email']").val(mail);

		mod.modal('show');
	});
	$("a.editArtist").on("click", function(event){
		var mod = $("#artistModal");
		var mods = mod.children("form");
		var tabl = $(this).parent("li").find("p").html();
		tabl = tabl.split(",|,");
		var hid = $(this).parent("li").find("b").html();
		mods.find("[name='hid']").val(hid);
		mods.find("[name='hid']").removeAttr('disabled');

		for(var i=0; i < tabl.length; i++){
			var val = tabl[i];
			var picker = mods.children(".modal-body").children(".control-group").eq(i).children(".controls").children().eq(0);
			mods.attr("action", "editArtist"); // HIER WIRDS GEDINGST
			if(val){
				picker.eq(i).val(val);
			}
		}
		mods.find("[name='artistName']").attr("readonly", "true");
		mod.modal('show');
	});
	$("a.clearForm").on("click", function(event){
		var mod = $(this).attr("href");
		$(mod).find("input").val("");
		if(mod == "#artistModal"){
			$(mod).find("form").attr("action", "addArtist")
			$(mod).find("[name='hid']").attr("disabled", "true");
			$(mod).find("[name='artistName']").removeAttr('readonly');
		}

	});
}

function declineAlb(){
	$("a.declineModal").on("click", function(event){
		var mod = $("#declineModal");
		var mods = mod.children("form");
		var row = $(event.target).parents("tr").children();
		var mail = row.eq(2).html();
		var id = row.find(".hidden").val();

		mods.children(".modal-body").find("[name='email_sav']").val(mail);
		mods.children(".modal-body").find("[name='albumId']").val(id);
		mod.modal('show');
	});
}

function changeGenre(){
	var sel = $(".genSelector");
	sel.on("click", function(event){
		var t = $(this);
		var val = t.attr("value");
		
		var id = $("#opt"+val);
		var html = id.html();
		t.parents(".btn-group").children("select").html(html);
		t.parents(".btn-group").children("input").val(val);
	});
}

function multiplicable(){
	$("#AjaxContent").on("click", "button.multiplique", function(e){
		var tt = e.target;
		var t = $(tt).parent().children(".controls");
		var inp = t.children(".multiplicable");
		var html = inp.html();
		t.append(html);
		var cntr = t.children(".input-append").length;
		var name = inp.find("input").attr("name");
		var name2 = name + cntr;
		var newInp = t.children(".input-append").find("input[name='"+name+"']");
		newInp.attr( "name", name2);
		newInp.prop('disabled', false);

	});

	$("#AjaxContent").on("click", "button.delmulti", function(e){
		var elem = $(this).parents(".input-append");
		fadeIO(elem);
		elem.remove();
	});
}

function checkSongRdy(){
	$("#ttab3").on("focusout", "input", function(){
		checkSongRdy2(this);
	});
	$("#ttab3").on("change", "select", function(){
		checkSongRdy2(this);
	});
}

function checkSongRdy2(th){
	var input = $(th).parents("form").find("input[disabled!='disabled']");
	var select = $(th).parents("form").find("select");
	var btn = $(th).parents("li[id*='Song_']").find("button[data-target*='#songOpt_']");
	var counter = 0;
	for(var i=0; i < input.length; i++){
		if(input.eq(i).val()!= "" && input.eq(i).val()!= undefined){
			counter++;
		}
	}
	if(counter == input.length && select.val() != "0"){
		btn.removeClass("btn-inverse").addClass("btn-success");
	}
	else{
		btn.removeClass("btn-success").addClass("btn-inverse");
	}
}

function tooltips(){
	$("[data-original-title]").tooltip({placement: "right", container: "body", delay: { show: 300, hide: 100 }});
}