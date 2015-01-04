var fs=require("fs");
var firstbuild=true;
browserifyShare=function(appfolder,cbfirstbuildcompleted){
  // you need to pass these three config option to browserify
  var browserify=require("browserify");
  var watchify=require("watchify");
  var b = browserify({
    cache: {},
    packageCache: {},
    fullPaths: true,
    debug:true,
    builtins: false,
    commondir: false,
    detectGlobals: false,
  });
  console.log("watching",appfolder+"index.js")
  b.add(appfolder+'index.js');
  b = watchify(b);
  b.on('update', function(){
    bundleShare(b,appfolder);
  });
  b.on("log", function(msg) {
  	console.log(appfolder+"bundle.js, "+msg);
    if (firstbuild && cbfirstbuildcompleted) {
      cbfirstbuildcompleted();
      cbfirstbuildcompleted=null;//only called once
      firstbuild=false;
    }
  });
  
  bundleShare(b,appfolder);
}

bundleShare=function(b,appfolder) {
  b.transform("reactify").bundle()
    //.pipe(source(appfolder+'index.js'))
   .pipe(fs.createWriteStream(appfolder+"bundle.js"));
  
}
module.exports=browserifyShare;