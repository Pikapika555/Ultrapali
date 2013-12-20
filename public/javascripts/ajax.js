var HAS_UPLOADS = 0;
/*
$.address.bind('change', function(event){
	console.log("PENIS");
	var names = $.map(event.pathNames, function(n) {
	
	return n.substr(0, 1).toUpperCase() + n.substr(1);
	}).concat(event.parameters.id ? event.parameters.id.split('.') : []);
		var links = names.slice();
		var match = links.length ? links.shift() + ' ' + links.join('.') : 'Home';
	$('a').each(function() {
		
	});

}); */ 
/*
$('a').click(function(e) {
		e.preventDefault();
		$("#ulSideNav").children().removeClass("active");
		$(this).parent().addClass('active');
		var links = names.slice();
		var match = links.length ? links.shift() + ' ' + links.join('.') : 'Home';
		console.log(this);

		//$.address.value($(this).attr('href'));
		//var url = $(this).attr('href');
		//ajaxRequest(url);
});*/
	
function ajaxRequest(url){
	$.ajax({
		url: url,
		type: "GET",
		success: function(data){
			$('#AjaxContent').html(data);
			console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!111");
			startup();
			if(url == "/upload" || url.indexOf("getJSON")){
				if(HAS_UPLOADS == 1){
					varPasser(url);
				}
			}
		}
	});
}


function bla(){

	var init = true,
		state = window.history.pushState !== undefined; 
	$(".siteChanger").address(function(){
		$("#ulSideNav").children().removeClass("active");
		$("#ulSideNav").find("[href='/upload']").parent().addClass("active");
		return $(this).attr('href').replace("#/", '')
	});
	$("#ulSideNav a").address(function(){
		return $(this).attr('href').replace("#/", '')
	});

	$.address.change(function(event){
		var uri = event.value;
		console.log("222");
		console.log("URI: "+uri);
		if(uri.length > 1){
			ajaxRequest(uri);
		}
	});
	
	$.address.externalChange(function(event){
		var uri = event.value;
		console.log("bla"+uri);
		if(uri === "/"){ uri = "/dashboard";} //ajaxRequest(uri);}
		
		$("#ulSideNav").children(".active").removeClass("active selected");
		var actiElem = $("#ulSideNav").find('[href*="'+uri+'"]').parent();
		actiElem.addClass("active");
		actiElem.focus();
	});


	$('#ulSideNav a').click(function(e) {
			
		$("#ulSideNav").children().removeClass("active");
		$(this).parent().addClass('active selected');
	}); 
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL;
}


function imgUpload(){
	
	var thumb = $("#previewPic");
	var input = $("#invisImgUpl").val();
	var splt = input.split(".");
	var ext = splt[splt.length - 1];
	if(ext == "jpg"){
		$('#uploadForm').ajaxSubmit({
			
			beforeSend:function(){
				$("#imageLoadSpinner").removeClass("hidden");
			},
			
			error: function(xhr) {
				//status('Error: ' + xhr.status);
			},

			success: function(response) {
				UPL_SAFETY = 1;
				thumb.attr("src","data:image/jpg;base64,"+response);
				$("#imageLoadSpinner").addClass("hidden");
				$("#spanFileName").html("File Uploaded");
			}
		});
	}
	else{
		alerta($(".media").eq(0), 1, "Bitte nur .jpg hochladen");
	}
}

function songInit(){

	$("#ttab3").on("change", "input.song",  function(e){
		var ctrGrp = $(this).parents(".control-group")
		var list = $(this).parents("li");
		var bar = list.find(".progress");
		var subBar = bar.children(".bar");
		var file = this.files[0];
		var Nr = list.attr("id").replace("Song_", "");
		var li = ctrGrp.parent("li");

		var splt = list.find("#invisSongUpl").val().split(".");
		var ext = splt[splt.length -1];
		console.log(ext);
		if(ext == "wav"){
		
			var formData = new FormData();
			var xhr = new XMLHttpRequest();
			
			console.log(file);
			
			console.log(this);
			
			var name = file.name;
			var len = name.length;
			if(len > 21){
				name = name.substring(0,10)+"..."+name.substring(len-10, len);
			}

			
			
			bar.removeClass("hidden");
			var spinner = "<i class='icon-spinner icon-spin'></i>";
			list.find("span[id='spanNrCount']").css("background-color", "#B3B3B3").css("border-color", "#B3B3B3");
			list.find("span[id='spanNrCount']").html(spinner);
			list.find("span[id='spanNrCount']").children("i").css("color", "#000").css("text-shadow", "0px 0px 0px #000");
			window.setTimeout(function () {
				bar.addClass("in");
			}, 50);
			
			formData.append('song', file);
			formData.append('Nr', Nr);
			
			xhr.open('post', '/uploadWav', true);
			
			 xhr.upload.onprogress = function(e) {
				if (e.lengthComputable) {
					var percentage = (e.loaded / e.total) * 100;
					subBar.css('width', percentage + '%');
				}
			};
			xhr.onreadystatechange = function(){
				if (xhr.readyState==4 && xhr.status==200){
					
					var inpSongId =  list.find("input[name='songId']")
					var inpFileName = list.find("input[name='trackFileName']");
					var pieceName = ctrGrp.find("#spanFileName");

					inpSongId.val(xhr.responseText);
					console.log(pieceName.html());
					if(pieceName.html() == "  Kein Song Hochgeladen" || pieceName.html() == inpFileName.val()){
						pieceName.html(name);
					}				
					
					//$(".collapse").collapse("hide");
					subBar.css('width', '100%');
					list.find("span[id='spanNrCount']").css("background-color", "#5EFF29").css("border-color", "#5EFF29");
					spinner = "<i class='icon-move'></i>";
					list.find("span[id='spanNrCount']").html(spinner);
					inpFileName.val(name);

					window.setTimeout(function () {	
						bar.removeClass("in");
						window.setTimeout(function(){
							bar.addClass("hidden");
							subBar.css('width', "0%");
						}, 50);
						
					},200);
				}
			}
			xhr.send(formData);
		}
		else{
			alerta($(".errorBox"), 1, "Bitte nur .wav hochladen");
		}
	});
}

function submitRouter(){
	
	$(".ajaxForm").submit(function(e){
			
			e.preventDefault();
			var form = $(this);
			if(!form.hasClass("submitting")){
				form.addClass("submitting");
				updateSett(form);
			}
	});
}


function updateSett(form){

form.ajaxSubmit({
	
	error: function(xhr) {
		alerta(form, 1, "DB connection");
		console.log(xhr);
	},

	success: function(response) {
		form.removeClass("submitting");
		if(response.login == 1){
			console.log("LOOOOOOOOGIIIIIN INFO BEKOMMEN!!!!!!!!!!")
			alerta(form, response.nr, response.msg);
			var bla = form.get(0);
			$(document).attr('location').href='/'
		}
		else if(form.hasClass("artistSubmit")){
			if(response.artist != undefined){
				$("select.artist").prepend("<option value='"+response.artist+"'>"+response.artist);
				$(".activeField").val(response.artist).attr('selected',true);
			}
				alerta(form, response.nr, response.msg, response.obj);
		}
		else{
			console.log(form);
			alerta(form, response.nr, response.msg, response.obj);
		}
	}
});

}

function alerta(id, state, msg, obj){
	var title;
	
	if(state == 0){ state = "alert-success"; title = "Yeah! - "}
	else{ state = "alert-error"; title = "Fehler! - "}

	var htmlString = '<div class="alert '+state+' fade"> <button class="close" type="button" data-dismiss="alert">&times;</button><strong>'+title+'</strong>'+msg+'</div>';
	oldAler = id.children(".alert");
	oldAler.remove();
	$(".error").removeClass("error");
	id.prepend(htmlString);
	
	window.setTimeout(function () {
		$(".alert").addClass("in");
	}, 50);
	if(obj){
		for(var i = 0; i < obj.length; i++){
			if($(obj[0]).is("div")){
				console.log("HEEEEEERE: ");
				console.log(obj[0]);
				/*
				for(var j = 0; j < obj[i].children(".btn.collapsed").length; j++){

				}
				*/
			}
			else{
				console.log("EEEELSE");
				console.log(obj[0]);
				id.find("[name='"+obj[i]+"']").addClass("error");
				id.find("[name='"+obj[i]+"']").parents(".control-group").addClass("error");
			}
		};	
	}
	
}

function postSongUpl(form, callback){

	form.ajaxSubmit({
		
		beforeSend:function(){
			//launchpreloader();
		},
		
		error: function(xhr) {
			//status('Error: ' + xhr.status);
		},

		success: function(response) {
			if(response.nr == 1){
				if(Error == 0 ){ Error = 1; }
				forms.push(new Array(form, response.nr, response.msg, response.obj)); 
				callback(response, forms);
			}
			else{
				callback(response);
			}
		}
	});

}

function ajaxPost(data, url, callback){
	$.ajax({
		type: "POST",
		url: url,
		data: data,
		success: function(res){
			callback(res);
		},
	});
}


/*
function wavUpload(){
	$.ajax({
        xhr: function() {
            var req = $.ajaxSettings.xhr();
            if (req) {
                req.upload.addEventListener('progress', function(event) {
                    if (event.lengthComputable) {
                        $('#ajaxFeedbackDiv').html(event.loaded); // = 'test'; //event.loaded + ' / ' + event.total;
                    }
                }, false);
            }
            return req;
        },
        type: "POST",
        url: "index.php?action=saveNewPost",
        data: img,
        contentType: "application/x-www-form-urlencoded;charset=UTF-8"
		success: function(data){
			//$('#AjaxContent').html(data);
		}
    });
}
*/