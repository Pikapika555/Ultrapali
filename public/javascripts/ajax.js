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
/*
	  //hashs (dann umwandeln in  /bla)
	$.address.change(function(event){
		event.preventDefault();
		//$.address.value(event);
		console.log(event);
	});
	$('a').click(function(e) {
		e.preventDefault();
		$.address.value($(this).attr('href'));
		var url = $(this).attr('href');
		ajaxRequest(url);
	}); */
}
