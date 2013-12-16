var mongoF = require('../routes/mongoF');





exports.create_list = function(req, res){
	var count = 5;//req.body.
	for(var i=0; i<count; i++){
		mongoF.createVoucher(req, res, function(){
			
		})
	}
}

exports.create_one = function(req, res){
	mongoF.createVoucher(req, res, function(voucher){
		res.send({voucher: voucher});
	});
}