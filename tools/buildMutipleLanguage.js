var xlsx = require('node-xlsx');
var fs = require('fs');

__dirname = __dirname+"/../"
var obj = xlsx.parse(__dirname + '/doc/mutiple_language/mutiple_language_config.xlsx'); // parses a file
var data = obj[0].data;

var lang_en_US = "var lang_en_US = {\n";
var lang_es_CO = "var lang_es_CO = {\n";
var lang_zh_CN = "var lang_zh_CN = {\n";

data.splice(0,1);

data.forEach(function (item) {
 if(item[0]){
  var key = '\t"'+item[0]+'"';
  if(item[1]){
   lang_en_US += key +":" + '"' + item[1] + '",\n'
  }else {
   lang_en_US += "//"+key +":" + '"' + " " + '",\n'
  }

  if(item[2]){
   lang_es_CO += key +":" + '"' + item[2] + '",\n'
  }else {
   lang_es_CO += "//"+key +":" + '"' + " " + '",\n'
  }

  if(item[3]){
   lang_zh_CN += key +":" + '"' + item[3] + '",\n'
  }else {
   lang_zh_CN += "//"+key +":" + '"' + " " + '",\n'
  }
 }else {
  lang_en_US+="\n";
  lang_es_CO+="\n";
  lang_zh_CN+="\n";
 }
})

lang_en_US += "};\n" + "export default lang_en_US;\n";
lang_es_CO += "};\n"+ "export default lang_es_CO;\n";
lang_zh_CN += "};\n"+ "export default lang_zh_CN;\n";

var languageDir = __dirname + "/src/lang/"

fs.writeFile(languageDir+"en_US.js", lang_en_US, function(err) {
 if(err) {
  return console.log(err);
 }
 console.log("en_US.js"+" was saved!");
});



fs.writeFile(languageDir+"es_CO.js", lang_es_CO, function(err) {
 if(err) {
  return console.log(err);
 }
 console.log("es_CO.js"+" was saved!");
});


fs.writeFile(languageDir+"zh_CN.js", lang_zh_CN, function(err) {
 if(err) {
  return console.log(err);
 }
 console.log("zh_CN.js"+" was saved!");
});
