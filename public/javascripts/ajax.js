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
			thumb.attr("src", response);
			$("#spanFileName").html("File Uploaded")
		}
	});
}


function submitRouter(){
	
	$(".one").submit(function(e){ 
		e.preventDefault();
		console.log("ASD");
		var form = $(this).attr("id");
		updateSett(form); 
	});
}


function updateSett(formName){

$("#"+formName).ajaxSubmit({
	
	error: function(xhr) {
		//status('Error: ' + xhr.status);
	},

	success: function(response) {
		console.log(response);
		alerta(formName.replace('form', ''), response.nr, response.msg);
	}
});

}

function alerta(id, state, msg){
	id = "#alert"+id;
	var title;
	
	if(state == 0){ state = "alert-success"; title = "Nice - "}
	else{ state = "alert-error"; title = "Error - "}

	$(id).addClass(state);
	
	var htmlString = '<button class="close" type="button" data-dismiss="alert">&times;</button><strong>'+title+'</strong>'+msg;
	
	$(id).html(htmlString);
	
	$(id).removeClass("hide");
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