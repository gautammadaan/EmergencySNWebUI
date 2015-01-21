var Perf = require('../models/PerfRest');
var Memory = require('../models/MemoryRest');

module.exports = function(_, io, participants) {
	return {
		getMemoryPage : function(req,res) {
			for(var sId in participants.all){
				if(participants.all[sId].userName == req.session.passport.user.user_name){
					if(participants.all[sId].role === "Monitor")
						res.render("memory", {enableMemory: "True"});
					else
						res.render("memory", {memStatus: "User with Monitor priviledge can measure memory", enableMemory: "False"});
					break;
				}
			}
		},
		getMemory : function(req,res) {
			console.log("Displaying memory results")
            Memory.getMemory(function(err, memory)
            {
                 if(err === null)
               {
                   var tmp = []
                   memory.forEach(function(memCrumb) {
                       tmp.push(memCrumb.local);
                   });
                   console.log('TMP : ' + tmp)
                   res.render('memory', {memoryArray : tmp, enableMemory: "True"});
               }
               else
               {
                   res.writeHead(404, {"Content-Type": "text/plain"});
                   res.write(err);
                   res.end();
               }

            });
		},
		startMemory : function(req,res) {
            console.log("Starting memory measurement")
            Memory.startMemory(function(err)
            {
                     res.render('memory', {enableMemory: "True"});

            });
		},
		stopMemory : function(req,res) {
		  console.log("Stopping measurement")
		  Memory.stopMemory(function(err)
            {
               if(err === null)
               {
                     res.render('memory', {enableMemory: "True"});
               }
               else
               {
                   res.writeHead(404, {"Content-Type": "text/plain"});
                   res.write(''+err);
                   res.end();
               }

            });
		},
		
		deleteMemory : function(req,res) {
            console.log("Deleting memory crumb")
            Memory.deleteMemory(function(err)
            {
                     res.render('memory', {});

            });
		},
		
		getMemoryTime : function(req,res) {
			console.log("Display measurement interval")
			var time = req.body.time;
            Memory.getMemoryTime(time, function(err, memory)
            {
                   if(err === null)
                   {
                       var tmp = []
                       memory.forEach(function(memCrumb) {
                           tmp.push(memCrumb.local);
                       });
                       console.log('TMP : ' + tmp)
                       res.render('memoryResult', {memoryArray : JSON.stringify(tmp)});
                   }
                   else
                   {
                       res.writeHead(404, {"Content-Type": "text/plain"});
                       res.write(err);
                       res.end();
                   }
            });
		},
		getSystemPerformace : function(req, res) {
//			Pass duration in milliseconds for next function
			var duration = (((req.body.duration)/2) * 1000);
			var stopSgnl = 0;//req.body.stopSgnl;
			var time_elapsed = 0, no_req = 0, post_perf = 0, get_perf = 0;
//			Start creating Database from here
			Perf.setupPerfSys(function(err){
				if(err === null){
//					Hit Post
					Perf.getWallPostPerf(duration, time_elapsed, no_req, stopSgnl, function(err, post_perf){
						if(err === null)
						{
//							Hit Get
							Perf.getWallGetPerf(duration, time_elapsed, no_req, stopSgnl, function(err, get_perf){
								if(err === null)
								{
									if(post_perf !==0 && get_perf !== 0)
									{
//										Reset the database
										Perf.resetTestData(function(err){
											return;
										});
									}
									res.render("performance", {post_perf: post_perf, get_perf: get_perf, 
																dbStatus: "Performance Testing", enable: "True", coordinator: "False"});
								}
							});
						}
					});
				}
			});
		},

		checkPerformance : function(req, res){
			for(var sId in participants.all){
				if(participants.all[sId].userName == req.session.passport.user.user_name){
					if(participants.all[sId].role === "Monitor")
						res.render("performance", {dbStatus: "Performance Testing", results: undefined,
														enable: "True", coordinator: "False"});
					else if(participants.all[sId].role === "Coordinator")
						res.render("performance", {dbStatus: "Analyze Social Network", results: undefined,
														enable: "False", coordinator: "True"});
					else
						res.render("performance", {dbStatus: "User with Monitor/Coordinator priviledge can analyze network",
													results: undefined, enable: "False", coordinator: "False"});
					break;
				}
			}
		},
		
		analyzeNetwork : function(req, res){
			var time_window = req.body.snaDuration;
			Perf.analyzeSocialNetwork(time_window, function(err, results){
				if(err === null)
					res.render("performance", {results: results, enable: "False", coordinator: "True"});
				else if(err !== null)
					res.render("performance", {dbStatus: "No Results Found", results: undefined, enable: "False", coordinator: "True"});
			});
		} 
	};
};
