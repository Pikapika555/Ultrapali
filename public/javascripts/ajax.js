var HISTORY_COUNT = 0;

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


	$('#ulSideNav a').click(function(e) {
			
		$("#ulSideNav").children().removeClass("active");
		$(this).parent().addClass('active selected');
	});
}

function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL;//.replace(/^data:image\/(png|jpg);base64,/, "");
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
			console.log(response);
			
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
		if(!response.nr){
			$("body").html(response);
		}
		else{
			alerta(form, response.nr, response.msg)
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