
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('homepage', { title: 'Express' });
};

exports.map = function (req, res) {
    res.render('gmap_search', {title: 'MAP SEARCH'});
};
