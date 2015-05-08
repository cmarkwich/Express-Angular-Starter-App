// needed to identify angular templates from backend calls

exports.templates = function(req, res){
  var filename = req.params.filename;
  if(!filename) return;  // might want to change this
  res.render("/build/templates/" + req.params );
};

exports.index = function(req, res){
  res.render('layout.ejs');
};