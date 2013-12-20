var mongoF = require('../routes/mongoF')
	, fs = require('fs')
	, async = require('async')
	, crypto = require('crypto')
	, zip = require("easy-zip").EasyZip;

var AT_SONG = 0;
var AT_STATE = 0;
var xml = "";

exports.create_product = function(req, res){
	// var product = req.session.product; ????
	
	//exports.check(req, res, function(req, res){
		//exports.create_folder(req, res, function(){
			exports.generate(req, res, function(stat, item, artist, gen){

				exports.create_xml(req, res, stat, item, artist, gen, function(doc){
					console.log("********************************************************callback");
					fs.writeFile("tmp/albums/"+gen.ean+"/"+gen.ean+".xml", doc, function(err){
						res.render('slides/download', {ean: gen.ean});
					});
				});
			});
		//});
	//});

}

exports.check = function(req, res, callback){
	if(state = "payed"){
		if(ean){
			product.ean = ean;
			callback(req, res);
		}
		else{
			exports.getEAN(req, res, function(){
				callback(req, res);
			});
		}
	}
	else{
		console.log("please pay first");
	}
}



exports.create_folder = function(req, res, songs, imgName, ean, songCnt, callback){
	path = "tmp/albums/"+ean+"/";
	
	fs.mkdir(path, 0777, function (err) {
		exports.create_data(req, res, path, songs, ean, songCnt, function(md5){
			exports.create_img(req, res, path, imgName, ean, function(md5_img){
				callback(md5, md5_img);
			});
		});
	});
	
		
}

exports.create_img = function(req, res, path, imgName, ean, callback){
	var user = req.params.user;
	var alb = req.params.asd;
	mongoF.getFileUser(req, res, user, alb, 0, 0, function(data){
		var hash = crypto.createHash('md5').update(data).digest("hex");
		fs.writeFile(path+ean+".jpg", data, function(err){
			callback(hash);
		});
	});
}

exports.create_data = function(req, res, path, songs, ean, songCnt, callback){
	var md5 = new Array();
	var counter = 0;
	console.log(songCnt);
	console.log("starting loop");
	exports.sWriteLoop(req, res, path, songs, ean, songCnt, md5, counter, function(){
		callback(md5);
	})
}

exports.sWriteLoop = function(req, res, path, songs, ean, songCnt, md5, counter, callback){
	var user = req.params.user;
	var alb = req.params.asd;
	var bla = counter+1;
	mongoF.getFileUser(req, res, user, alb, songs["song_"+bla].songId, 0, function(data){
		console.log("ROUND");
		counter++;
		console.log("write song nr: "+ counter);
		var songNr = "0"+counter;
		songNr = songNr.substring(songNr.length - 2);

		var hash = crypto.createHash('md5').update(data).digest("hex");
		md5.push(hash);
		fs.writeFile(path+ean+"_01_"+songNr+".wav", data, function(err){
			console.log("***********HIER*********")
			console.log(counter+"   "+ songCnt)
			if(counter == songCnt){
				callback(md5);
			}
			else{
				exports.sWriteLoop(req, res, path, songs, ean, songCnt, md5, counter, callback);
			}
		});
	});
}


exports.create_xml = function(req, res, stat, item, artist, gen, callback){
	var albInfo = item.albumInfo;
	var sonInfo = item.songsInfo;
	xml = '\
<?xml version="1.0" encoding="UTF-8"?> \n\
<delivery xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \n\
xsi:noNamespaceSchemaLocation="http://dmb.kontornewmedia.com/docs/ingestion/schema/KNM-import-4.1.xsd"> \n\
	\n\
	<delivery_info> \n\
		<client_id>1338</client_id> \n\
		<user_id>1560</user_id>\n\
		<date>'+gen.date+'</date>\n\
		<type>insert</type>\n\
	</delivery_info> \n\
	<bundle_info>\n\
		<label_name>Darktunes Netlabel</label_name>\n\
		<ean_upc>'+gen.ean+'</ean_upc>\n\
		<catalogue_no>'+gen.catNr+'</catalogue_no>\n\
		<language>'+albInfo.Language+'</language>\n\
	</bundle_info>\n\
	<bundle>\n\
		<title>'+albInfo.title+'</title>\n\
		<type>'+gen.albType+'</type>\n\
		<track_only>false</track_only>´\n\
		<pricing>\n\
			<price codeset="dmb">'+gen.priceType+'</price>\n\
			<price codeset="itunes">'+gen.ituType+'</price>\n\
		</pricing>\n\
		';
	if(albInfo.gemaNr != undefined){
		xml+= '<gema_no>'+albInfo.gemaNr+'</gema_no>\n';
	}
	if(albInfo.subtitle != undefined){
		xml += '	<subtitle>'+albInfo.subtitle+'</subtitle>\n';
	}
	if(albInfo.promotext != undefined){
		xml +='		<promotional_text>'+albInfo.promotext+'</promotional_text>\n';
	}

	xml += '\
			<disc_count>'+gen.discCnt+'</disc_count>\n\
			<track_count>'+gen.songCnt+'</track_count>\n\
			<release_dates>\n\
				<digital_release_date>'+albInfo.digital_ReleaseDate+'</digital_release_date>\n\
				<digital_cancelation_date>2199-11-25</digital_cancelation_date>\n\
	';
	
	if(albInfo.cdReleaseDate != undefined){
		xml += '			<physical_release_date>'+albInfo.cdReleaseDate+'</physical_release_date>\n';
	}
	xml += '\
			</release_dates>\n\
			<prelisten_audio>true</prelisten_audio>\n\
			<c_year>'+gen.cdate+'</c_year>\n\
			<c_line>Darktunes Netlabel</c_line>\n\
			<p_year>'+gen.cdate+'</p_year>\n\
			<p_line>Darktunes Netlabel</p_line>\n\
			<contributors>\n\
			';
			
			//FOREACH CONTRIB
			
	for(key in gen.contr){
		var prim = "false";
		var cont = gen.contr[key];
		cont = cont.split("/../");
		if(key == 0){prim = "true";}
		xml += '\
				<contributor>\n\
					<primary>'+prim+'</primary>\n\
					<full_name>'+cont[0]+'</full_name>\n\
					<role>'+cont[1]+'</role>\n\
				</contributor>\
		';
	}

	//genres
		xml +='\n\
	</contributors>'
		var xml_genres = "";
		xml_genres += '\n\
			<genres>\n\
				<genre codeset="dmb">'+albInfo.genre+'</genre>\n\
				<genre codeset="dmb">'+albInfo.subgenre+'</genre>\n\
				<specific_genre>'+albInfo.individual_genre+'</specific_genre>\n\
			</genres>\
		'
		xml += xml_genres;

	//territories
	xml += '\n\
			<territories>\n\
				<territory use="include">WW</territory>\n\
			</territories>\n\
	'

	//retailer
	xml += '\
		<retailers>\n\
				<default>\n\
					<download>true</download>\n\
					<streaming>true</streaming>\n\
					<subscription>true</subscription>\n\
					<mobile>true</mobile>\n\
				</default>\n\
				<retailer>\n\
					<id type="dmb">*</id>\n\
					<download>true</download>\n\
					<streaming>true</streaming>\n\
					<subscription>true</subscription>\n\
					<mobile>true</mobile>\n\
				</retailer>\n\
			</retailers>\n\
			<media>\n\
				<file type="front_cover" md5="'+gen.md5_img+'">'+gen.ean+'.jpg</file>\n\
			</media>\n\
			<track_list>\
	';

	//media
	exports.songWriter(0, albInfo, gen, sonInfo, xml, function(xml){
		callback(xml);
	});
	
}



exports.finish = function(req, res){
	//lade handshake file
	var a = 1;
}






/////////////////////
// Check functions //
/////////////////////

exports.getEAN = function(req, res, callback){
	product.ean = 1;
	callback(req, res);
}

///////////////////
// Gen Functions //
///////////////////

exports.generate = function(req, res, callback){
	var mail = req.params.user;
	var id = req.params.asd;
	var elem = "albums";
	var elem2 = "artist";
	mongoF.setStat(req, res, "albums", 1, function(stat){
		mongoF.findUnSpecific(req, res, mail, elem, id, function(item){
			mongoF.findUnSpecific(req, res, mail, elem2, 1, function(artist){
			
				var d = new Date();
				var year = d.getFullYear();
				var month = "0"+d.getMonth();
				var day = "0"+d.getDate();
				month = month.toString();
				day = day.toString();
				month = month.substring(month.length - 2);
				day = day.substring(day.length - 2);
				var date = year+"-"+month+"-"+day;

				var shrtYear = year.toString();
				shrtYear = shrtYear.substring(shrtYear.length - 2);
				month = month.toString();
				month = month.substring(month.length-2);
				day = day.toString();
				day = day.substring(day.length-2);

				var album = item[id];
				var songs = album.songsInfo;
			
				var aAmt = "000" + stat.albums;
				aAmt = aAmt.toString();
				aAmt = aAmt.substring(aAmt.length -4);
				var catNr = "dt" + shrtYear + aAmt;
				if(album.albumInfo.barcode){
					req.session.BARCODE = album.albumInfo.barcode;
				}


				
				var songCnt = Object.keys(songs).length;
				var priceType = "AC";
				var albType = "Album";
				var ituType = "52";
				if(songCnt <= 20){
					priceType = "AA";
					albType = "Album";
					ituType = "34";
					if(songCnt <= 10){
						ituType = "5"
						priceType = "AD";
						ituType = "3";
						if(songCnt <= 7){
							priceType = "AS";
							albType = "EP";
							ituType = "32";
							if(songCnt <= 4){
								priceType = "MA";
								albType = "EP";
								ituType = "5";
								if(songCnt < 2){
									priceType = "TB";
									albType = "Single";
									ituType = "99";
								}
							}
						}
					}
				}

				
				exports.genEAN(req, res, function(ean){
					console.log(ean);
					exports.create_folder(req, res, songs, album.imageName, ean, songCnt, function(md5, md5_img){
						console.log("created folder");
						exports.contrib(req, res, album, function(contri){
							exports.genISRC(req, res, songCnt, function(isrc){
								var gen = {
									date: date
									, cdate : year
									, ean: ean
									, catNr : catNr
									, songCnt: songCnt
									, priceType : priceType
									, albType: albType
									, discCnt: 1
									, contr: contri
									, isrc : isrc
									, md5 : md5
									, md5_img : md5_img
									, ituType: ituType
								};

								callback(stat, album, artist, gen);
							});
						});
					});

				});
			});
		});
	});
}

exports.genOptional = function(req, res, item, callback){
	//EAN

	//ISRC
}

exports.contrib = function(req, res, item, callback){
	var contrib = new Array();
	var mainArt = item.albumInfo.Interpret+"/../"+"Performer";
	contrib.push(mainArt);
	if(item.albumInfo.featuredBy && item.albumInfo.featuredBy != mainArt){
		contrib.push(item.albumInfo.featuredBy+"/../"+"Featuring");
	}
	callback(contrib);
}


exports.genEAN = function(req, res, callback){
	//426036381 000 5
	if(!req.session.BARCODE){
		console.log("not! own barcode");
		var ean = "426036381";
		mongoF.setStat(req, res, "ean", 1, function(stat){
			var nr = "000" + (stat.ean)
			nr = nr.substring(nr.length - 3);
			ean += nr;

			var arr = ean.split("");
			var prufzahl = 0;
			for(var i=0; i<arr.length; i++){
				if(((i % 2) != 0) && i != 0){
					arr[i] = parseInt(arr[i]) * 3;
				}
				prufzahl += parseInt(arr[i]);
			}
			prufzahl = prufzahl % 10;
			if(prufzahl != 0){
				prufzahl = 10 - prufzahl;
			}
			ean = ean + prufzahl;
			callback(ean);
		});
	}
	else{
		console.log("own barcode");
		callback(req.session.BARCODE);
	}
}

exports.genISRC = function(req, res, songcnt, callback){
	var ISRC = new Array();
	mongoF.setStat(req, res, "isrc", songcnt, function(stat){
		var bla  = parseInt(stat.isrc) - parseInt(songcnt);
		var year = new Date();
		year = year.getFullYear();
		year = year.toString();
		year = year.substring(year.length - 2);
		for(var i=0; i<songcnt; i++){
			console.log("****"+ i + "++" + songcnt+ "****");
			var nr = "0000" + (bla + i);
			nr = nr.substring(nr.length - 5);
			var isrc = "DESE5" + year + nr;
			ISRC.push(isrc);
			if(i == songcnt-1){
				callback(ISRC);
			}
		}
	});
}


exports.dlProduct = function(req, res){
	var ean = req.params.ean;
	var path = "tmp/albums/"+ean+"/";
	var sPath = "tmp/albums/";
	console.log("beginne zippen");
	var zip1 = new zip();
	zip1.zipFolder(path, function(){
		console.log("habe gezippt");
		zip1.writeToFile(sPath+ean+".zip", function(){
			console.log("habe file geschrieben");
			res.download(sPath+ean+".zip", ean+".zip");
		});
	});
}








exports.loop = function(until, fn, callback, counter){
	if(!counter){
		var counter = 0;
	}
		counter++
		fn();
	if(until == counter){
		callback();
	}
	else{
		exports.loop(until, fn, callback, counter);
	}
}


/// NU TESTING AREA
/// 



exports.songWriter = function(AT_SONG, albInfo, gen, sonInfo, xml, callback){
		var sonLeng = Object.keys(sonInfo).length; // SO FINDET MAN
		
		AT_SONG = AT_SONG + 1;
		exports.songWriter1(AT_SONG, albInfo, gen, sonInfo, xml, function(xml){
			console.log("GEHT IN DAS CALLBACK");
			if(AT_SONG == sonLeng){
					xml += '\n\
					</track_list>\n\
				</bundle>\n\
			</delivery>\n\
			';
			callback(xml);
			}
			else{
				exports.songWriter(AT_SONG, albInfo, gen, sonInfo, xml, callback);
			}
		});


}

exports.songWriter1 = function(AT_SONG, albInfo, gen, sonInfo, xml, callback){
	console.log("SW START");
	console.log(AT_SONG);

	var song = sonInfo["song_"+AT_SONG];
	console.log("******");
	console.log(song);
	console.log("*******");
	var cleanNr = "0" + AT_SONG;
	cleanNr = cleanNr.substring(cleanNr.length - 2);
	xml += '\n\
		<track>\n\
			<language>'+albInfo.Language+'</language>\n\
			<isrc>'+gen.isrc[AT_SONG - 1]+'</isrc>\n\
			<disc>1</disc>\n\
			<number>'+AT_SONG+'</number>\n\
			<title>'+song.trackTitle+'</title>\n\
			<live_version>'+song.liveVersion+'</live_version>\n\
			<cover_version>'+song.coverVersion+'</cover_version>\n\
			<explicit_lyrics>'+song.explicitContent+'</explicit_lyrics>\n\
			<instrumental_version>'+song.instrumental+'</instrumental_version>\n\
			<pricing>\n\
				<price codeset="dmb">TB</price>\n\
				<price codeset="itunes">99</price>\n\
			</pricing>\n\
			<genres>\n\
				<genre codeset="dmb">'+albInfo.genre+'</genre>\n\
				<genre codeset="dmb">'+albInfo.subgenre+'</genre>\n\
				<specific_genre>'+albInfo.individual_genre+'</specific_genre>\n\
			</genres>\
			<contributors>\n\
				<contributor>\n\
					<primary>true</primary>\n\
					<full_name>'+song.Künstler+'</full_name>\n\
					<role>Performer</role>\n\
				</contributor>\n\
		';
		var i = 0;
		var j = 0;
		exports.loop(10, function(){
			i++;
			var aKomp = "kompName_"+i;
				if(song[aKomp]){
					xml += '\
									<contributor>\n\
										<primary>false</primary>\n\
										<full_name>'+song[aKomp]+'</full_name>\n\
										<role>Composer</role>\n\
									</contributor>\n\
					';
				}
		}, function(){
			exports.loop(10, function(){
				j++;
				var aText = "textAuth_"+j;
					if(song[aText]){
						xml += '\
									<contributor>\n\
										<primary>false</primary>\n\
										<full_name>'+song[aText]+'</full_name>\n\
										<role>Lyricist</role>\n\
									</contributor>\n\
						';
					}
				}, function(){
					if(song.remixName != undefined){
								xml += '\
												<contributor>\n\
													<primary>false</primary>\n\
													<full_name>'+song.remixName+'</full_name>\n\
													<role>Remixer</role>\n\
												</contributor>\n\
								';
							}
							if(song.featuredBy != undefined){
								xml += '\
												<contributor>\n\
													<primary>false</primary>\n\
													<full_name>'+song.featuredBy+'</full_name>\n\
													<role>Featuring</role>\n\
												</contributor>\n\
								';
							}

						xml += '\
										</contributors>\n\
										<publishers>\n\
											<publisher>Darktunes Netlabel</publisher>\n\
											<publisher>Copyright Control</publisher>\n\
										</publishers>\
										';
				 
								
						xml += '\n\
							<usage>\n\
								<download>true</download>\n\
								<streaming>true</streaming>\n\
								<subscription>true</subscription>\n\
								<mobile>true</mobile>\n\
								<bundle-only>false</bundle-only>\n\
							</usage>\n\
							<p_year>'+gen.cdate+'</p_year>\n\
							<p_line>Darktunes Netlabel</p_line>\n\
							<share_policy>Monetize</share_policy>\n\
							<commercial_policy>Monetize</commercial_policy>\n\
							<media>\n\
								<file type="audio_asset" md5="'+gen.md5[AT_SONG-1]+'">'+gen.ean+'_01_'+cleanNr+'.wav</file>\n\
							</media>\n\
						</track>\n\
						';
						console.log("RETURNS");
						callback(xml);
			});
		});
}


