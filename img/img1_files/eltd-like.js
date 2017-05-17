var $j = jQuery.noConflict();

$j(document).ready(function($){
	initElatedLike();
});

function initElatedLike(){
	$j(document).on('click','.eltd-like', function() {

		var $likeLink = $j(this);
		var $id = $j(this).attr('id');
		
		if($likeLink.hasClass('liked')) return false;

		var $type = '';
		if(typeof $j(this).data('type') !== 'undefined') {
			$type = $j(this).data('type');
		}

		var $dataToPass = {
			action: 'eltd_like', 
			likes_id: $id,
			type: $type
		}
		
		var like = $j.post(eltdLike.ajaxurl, $dataToPass, function(data){
			$likeLink.html(data).addClass('liked').attr('title','You already like this!');

			if($type != 'portfolio_list') {
				$likeLink.find('span').css('opacity',1);
			}
		});
	
		return false;
	});
}