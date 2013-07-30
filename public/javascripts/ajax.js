
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
			startup();
		}
	});
}


function bla(){

	$("#ulSideNav a").address(function(){
		return $(this).attr('href').replace("#/", '')
	});

	$.address.change(function(event){
		var uri = event.value;
		if(uri.length > 1){
			ajaxRequest(uri);
		}
	});
	
	$.address.externalChange(function(event){
		var uri = event.value;
		console.log("bla"+uri);
		if(uri == "/"){ uri = "/dashboard";} //ajaxRequest(uri);}
		$("#ulSideNav").children(".active").removeClass("active selected");
		var actiElem = $("#ulSideNav").find('[href*="'+uri+'"]').parent();
		actiElem.addClass("active");
		actiElem.focus();
	})


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
	
	$('#uploadForm').ajaxSubmit({
		
		beforeSend:function(){
			//launchpreloader();
		},
		
		error: function(xhr) {
			//status('Error: ' + xhr.status);
		},

		success: function(response) {
			UPL_SAFETY = 1;
			thumb.attr("src","data:image/jpg;base64,"+response);
			
			$("#spanFileName").html("File Uploaded")
		}
	});
}


function submitRouter(){
	
	$(".ajaxForm").submit(function(e){
		e.preventDefault();
		var form = $(this);
		updateSett(form); 
	});
}


function updateSett(form){

form.ajaxSubmit({
	
	error: function(xhr) {
		alerta(form, 1, "DB connection");
		console.log(xhr);
	},

	success: function(response) {
		if(response.login == 1){
			alerta(form, response.nr, response.msg);
			var bla = form.get(0);
			$(document).attr('location').href='/'
			console.log(bla);
			console.log(form);
		}
		else{
			alerta(form, response.nr, response.msg);
		}
	}
});

}

function alerta(id, state, msg){
	var title;
	
	if(state == 0){ state = "alert-success"; title = "Success - "}
	else{ state = "alert-error"; title = "Error - "}

	var htmlString = '<div class="alert '+state+'"> <button class="close" type="button" data-dismiss="alert">&times;</button><strong>'+title+'</strong>'+msg+'</div>';
	$(".alert").remove();
	id.prepend(htmlString);
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
			callback(response);
		}
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