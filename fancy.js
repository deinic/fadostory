var images = {
    1: [
        {
            href : 'http://fancyapps.com/fancybox/demo/1_b.jpg',                
            title : 'Gallery 1 - 1'
        },
        {
            href : 'http://fancyapps.com/fancybox/demo/2_b.jpg',                
            title : 'Gallery 1 - 2'
        },
        {
            href : 'http://fancyapps.com/fancybox/demo/3_b.jpg',                
            title : 'Gallery 1 - 3'
        }
    ],
    2: [
        {
            href : 'http://fancyapps.com/fancybox/demo/4_b.jpg',                
            title : 'Gallery 2 - 1'
        },
        {
            href : 'http://fancyapps.com/fancybox/demo/5_b.jpg',                
            title : 'Gallery 2 - 2'
        }
    ]
};


	$(document).ready(function() {
		$(".open_fancybox").click(function() {
			//var id = $(this).attr('id');
    $.fancybox.open(images[$(this).index() + 1], {
        padding : 0
    });
    
    return false;
});
});

//$(this).index() + 1

