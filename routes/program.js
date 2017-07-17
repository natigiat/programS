var express = require('express');
var router = express.Router();
var async = require('async');


var request = require('request');
var cheerio = require('cheerio');


var color = require('img-color');


var getJSON = require("simple-get-json");

var Program = require('../modules/program.js');



/* GET all pruduct in homepage */
router.get('/:id', function(req, res, next) {
  var id= req.params.id;
  
 

  var results;
  results = {};

  async.parallel({
      ProgramAll: function(callback) {
        return Program.findOne({_id:id}, function(err, result) {
         return callback(err, result);
        });
      },


    }, function(err, results) {
      // return res.json(results.promotions);
      var ProgramAll = results.ProgramAll;

      res.render('program', { title: 'Express' , ProgramAll:ProgramAll});
  });
  

});






router.get('/scrap/pruducts', function(req, res, next) {
  
  var urls = ["https://www.goabroad.com/providers/don-quijote/programs/learn-spanish-in-granada-with-donquijote-11822", "https://www.goabroad.com/providers/don-quijote/programs/intensive-spanish-with-don-quijote-142357", "https://www.goabroad.com/providers/don-quijote/programs/learn-spanish-in-ecuador-with-don-quijote-142352", "https://www.goabroad.com/providers/don-quijote/programs/learn-spanish-in-marbella-with-don-quijote-142350", "https://www.goabroad.com/providers/don-quijote/programs/learn-spanish-in-costa-rica-with-don-quijote-142323", "https://www.goabroad.com/providers/don-quijote/programs/learn-spanish-in-madrid-with-don-quijote-142315", "https://www.goabroad.com/providers/don-quijote/programs/learn-spanish-in-mexico-with-don-quijote-142140", "https://www.goabroad.com/providers/don-quijote/programs/internship-in-spain-or-latin-america-with-don-quijote-91445", "https://www.goabroad.com/providers/don-quijote/programs/scuba-diving-in-spain-and-latin-america-with-donquijote-81854", "https://www.goabroad.com/providers/don-quijote/programs/dele-preparation-courses-with-donquijote-81833", "https://www.goabroad.com/providers/don-quijote/programs/don-quijote-spanish-history-art-or-literature-in-granada-or-guanajuato-81821", "https://www.goabroad.com/providers/don-quijote/programs/don-quijote-spanish-christmas-course-81809", "https://www.goabroad.com/providers/don-quijote/programs/spanish-fo-50-program-don-quijote-81802", "https://www.goabroad.com/providers/don-quijote/programs/part-time-spanish-course-with-don-quijote-81801", "https://www.goabroad.com/providers/don-quijote/programs/spanish-conversation-course-speak-spanish-with-donquijote%21-81800", "https://www.goabroad.com/providers/don-quijote/programs/learn-spanish-in-spain-and-latin-america-with-don-quijote%21-56843", "https://www.goabroad.com/providers/don-quijote/programs/learn-spanish-in-alicante-with-don-quijote-15949", "https://www.goabroad.com/providers/don-quijote/programs/learn-spanish-in-malaga-with-don-quijote-15948", "https://www.goabroad.com/providers/don-quijote/programs/learn-spanish-with-don-quijote-in-tenerife-15947", "https://www.goabroad.com/providers/don-quijote/programs/learn-spanish-in-valencia-with-don-quijote-15945", "https://www.goabroad.com/providers/don-quijote/programs/learn-spanish-in-guanajuato-with-don-quijote-11823", "https://www.goabroad.com/providers/don-quijote/programs/learn-spanish-in-barcelona-with-don-quijote-11821", "https://www.goabroad.com/providers/don-quijote/programs/learn-spanish-in-seville-with-don-quijote-11820", "https://www.goabroad.com/providers/don-quijote/programs/learn-spanish-in-salamanca-with-don-quijote-11819", "https://www.goabroad.com/providers/don-quijote/programs/learn-spanish-in-spain-with-don-quijote-11817"];
  

  for (var i = 1; i <= urls.length ; i++) {
  	var url = urls[i];
    getData(url);
  }
  

  function getData(url){

	    request(url, function(error, response, html){
	        if(!error){
	            var $ = cheerio.load(html);
                
                var summary 		     = $('.lising-intro-desc-content').find('p').text();
		        var providedByImage      = $('.provider-logo').find('img').attr("src");	 
		        var website  		     = $('.clickTracker').attr("href"); 
		        var name  			     = $('.listing-information-section').find('h1').text(); 
		        //more info
		        
				var courses  		     = $('.other-info-contents').find('ul').eq(1).find("li").text(); 
				var languages  		     = $('.other-info-contents').find('ul').eq(2).find("li").text(); ;
				var dates 			 	 = $('.other-info-contents').find('ul').eq(3).find("li").text(); 
				var includes 		 	 = $('.other-info-contents').find('ul').eq(4).find("li").text(); 
				var accommodation    	 = $('.other-info-contents').find('ul').eq(5).find("li").text(); 
				var languageSkills  	 = $('.other-info-contents').find('ul').eq(6).find("li").text(); 
				var experienceRequired   = $('.other-info-contents').find('ul').eq(7).find("li").text(); 
				


				var mainImage  			 = $('.big-photo').find('img').attr("src");	 
				var images  			 = $('.jcarousel-skin-tango').find('img').attr("src");	; 
				var video  				 = $('.jcarousel-skin-tango').find('a').attr("href"); 
				var views  				 = Math.floor(Math.random() * 100) + 7  ; ; 
				var rate  				 = Math.floor(Math.random() * 10) + 7  ; 
                 


            
			    var newProgram = new Program({      
			        summary             :   summary,
					providedByImage  	:	providedByImage,
					website  			:	website,
					name  				:	name,
					courses  			:	courses,
					languages  			:	languages,
					dates  				:	dates,
					includes  			:	includes,
					accommodation  		:	accommodation,
					languageSkills  	:	languageSkills,
					experienceRequired  :	experienceRequired,
					mainImage  			:	mainImage,
					images  			:	images,
					video  				:	video,
					views  				:	views,
					rate  				:	rate,
			    });

			    newProgram.save(function(err ,newProgram) {
			      if(err) {
			          console.log(err);
			      }

			    });    
				    
	        }
	    })
  
  }

	   
  // seeded!
  res.send('Database seeded!');

});


router.get('/seed/json', function(req, res, next) {
    
    
    // "video" : "https://www.youtube.com/embed/nS2IYuDWwsU",
    // "likes"
    


    getJSON('https://graph.facebook.com/v2.9/287144568142253/feed?fields=full_picture%2Ccreated_time%2Cmessage%2Cfrom%2Cattachments%7Bsubattachments%7D&limit=300&__paging_token=enc_AdBDrZCKZB1ZCmyHi6mdVZC6WGcUC8g5RWk96uUem4FZB7zBQZABlY7tDIyhDa9sDXHlMvGgo5gBedJq3ZCcMzLMXrEmGiTZBVOUCUFEV6ZCifCj8DiBnfQZDZD&icon_size=16&until=1499063043&access_token=EAACEdEose0cBAFyMrNVIk9V8FCYZCzXxyAzwejxAPPt6ZBOShXR5CvMU9hwoZCI2uFe1RSfLiVILcq05mI8BwoLwG69fzUZA5rVuUDkQFfPuE5ILIosMXvI1s8c1EmL3EZAZBCMYTaBVZCTVLSmYospFAvUWe7kCg3BaTfEg4O2CzZBY6dMVkQAkvGxh4q1X9TQZD', function (obj) {     
    // Do something with "obj1" and "obj2" `

    var name;
    var priceLoc;
    var priceLocFinish;
    var price;
    var Inprice;
    var phone;
    var Inphone;

    for (var k in obj.data){   
        
        var description = obj.data[k].message;
        var replace     = "לא";
        var image       = typeof(obj.data[k].full_picture) !== "undefined" ? obj.data[k].full_picture :"/images/noImage.png";
        var imagesSrc   = typeof(obj.data[k].attachments) !== "undefined" ? obj.data[k].attachments : "";
        var images      = [];
        var dominantColor;
        var video       = "";
        var place       = "23";
        var condition   = "2";
        var time        = obj.data[k].created_time;
        var facebookId      = obj.data[k].from.id;
        
        console.log(facebookId);
        if (typeof(description) !== "undefined") {

          name = obj.data[k].message.substring(0, 20);
           
   
          // console.log(obj.data[k].message)
   
          price  = obj.data[k].message.match(/₪[\w,]+/); 
          if (price !== null){
            price = price.toString();
            price = price.replace(/\D/g, "");
            Inprice = parseInt(price);
            
          }

          //imaghes array 
          for (var s in imagesSrc){  
              for (var z in imagesSrc[s]){   
                    var inside = imagesSrc[s][z].subattachments.data;
                    for (var x in inside){ 
                         var srcImage = inside[x].media.image.src;
                         images.push(srcImage);
                    }
              }
          };

          //phone get from text
          phone  = parseInt(obj.data[k].message.match(/[\w-]{10,11}/));
          


          phone = phone.toString();
          Inphone = phone.replace( /^\D+/g, '');
          // console.log("numberrrrrrrrrrrrrrrrrrr" + Inphone)


        }

       
        if(phone.length > 8) {
            var newProgram = new Program({      
              name: name,
              description: description,
              price: Inprice,
              phone:"0"+Inphone,
              place: place,
              condition: condition,
              dominantColor:dominantColor,
              image: image,
              images: images,
              video: video,
              replace: replace,
              facebookId :facebookId,
              time : time
            });

            newProgram.save(function(err ,newManage) {
              if(err) {
                  console.log(err);
              }

            });    

        }
 

    }     
    res.send('Sedd Start!');  
  });

  // seeded!
  

});



module.exports = router;
