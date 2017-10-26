var imageContainerMargin = 70;  // Margin + padding

// This watches for the scrollable container
var scrollPosition = 0;
$('div#contents').scroll(function() {
  scrollPosition = $(this).scrollTop();
});

function initMap() {

  // This creates the Leaflet map with a generic start point, because code at bottom automatically fits bounds to all markers
  var map = L.map('map', {
    center: [0, 0],
    zoom: 5,
    scrollWheelZoom: false
  });


//OSM
        /*var basemap0 = L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>,&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 28
        });
        basemap0.addTo(map);*/

        
/*var OpenMapSurfer_Roads = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
	maxZoom: 19,
	attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
OpenMapSurfer_Roads.addTo(map);*/

//EDIFICATO
$.ajax({
    url: 'edificato_lisboa.json',
    success: function (data) {
        var geojson = new L.geoJson(data, {
         style:{
                color: 'gray',
            }  
}).addTo(map);
 }
});   
   
   
        
//ITINERARIO
$.ajax({
    url: 'itinerario.json',
    success: function (data) {
        var geojson = new L.geoJson(data, {
         style:{
                color: 'red',
                weight: 3,
                opacity: 1,
                dashArray: '20,15',
                lineJoin: 'round'
            }  
}).addTo(map);
 }
});
//MONUMENTOS
$.ajax({
    url: 'monumentos.json',
    success: function (data) {
        var geojson = new L.geoJson(data, {
                style: function(feature) {
						
      if(feature.properties.NOME === 'NULL'){
        return {fillColor: 'green', weight: 2 };
      } else if(feature.properties.NOME === 'Museu do Fado e da Guitarra'){
        return { fillColor: '#a11717', fillOpacity: 1,weight: 0};
      } else if(feature.properties.NOME === 'Igreja de Santa Luzia'){
        return { fillColor: 'yellow', fillOpacity: 1,weight: 0 };
     }else if(feature.properties.NOME === 'Convento do Menino-Deus'){
        return { fillColor: '#ff5a00', fillOpacity: 1,weight: 0};
      } else if(feature.properties.NOME === 'Col&eacute;gios dos Meninos &Oacute;rf&atilde;os'){
        return { fillColor: '#636a1b', fillOpacity: 1,weight: 0 };
      } else if(feature.properties.NOME === 'Castelo S&atilde;o Jorge'){
        return { fillColor: '#68b0d9', fillOpacity: 1,weight: 0 };
      } else if(feature.properties.NOME === 'Pal&aacute;cio Belmonte'){
        return { fillColor: '#b270db', fillOpacity: 1,weight: 0 };
      } else if(feature.properties.NOME === 'Pal&aacute;cio dos Condes de Figueira'){
        return { fillColor: '#e3d568',fillOpacity: 1,weight: 0 };
      } else if(feature.properties.NOME === 'Museu de Artes Decorativas - Pal&aacute;cio Azurara'){
        return { fillColor: '#694f4f', fillOpacity: 1,weight: 0};
      } else if(feature.properties.NOME === 'Capela de Nossa Senhora da Sa&uacute;de'){
        return { fillColor: '#17a127', fillOpacity: 1,weight: 0}
      } 
      else {
        return { color: 'green', weight: 2 };
      }

    }
   }).addTo(map);     
 }
});
    
  // This loads the GeoJSON map data file from a local folder
  $.getJSON('map.geojson', function(data) {
    var geojson = L.geoJson(data, {
      onEachFeature: function (feature, layer) {
        (function(layer, properties) {
          // This creates numerical icons to match the ID numbers
          // OR remove the next 6 lines for default blue Leaflet markers
          var numericMarker = L.ExtraMarkers.icon({
            icon: 'fa-number',
            number: feature.properties['id'],
            markerColor: 'blue'
          });
          layer.setIcon(numericMarker);

          // This creates the contents of each chapter from the GeoJSON data. Unwanted items can be removed, and new ones can be added
          var chapter = $('<p></p>', {
            text: feature.properties['chapter'],
            class: 'chapter-header'
          });

          var image = $('<img>', {
            src: feature.properties['image'],
            
          });
		var href=$('<a>',{
			class:'open_fancybox',
			//rel:"group",
			id:feature.properties['id'],
			href: feature.properties['image'],
			
			});

          var source = $('<a>', {
            text: feature.properties['source-credit'],
            href: feature.properties['source-link'],
            target: "_blank",
            class: 'source'
          });

          var description = $('<p></p>', {
            text: feature.properties['description'],
            class: 'description'
          });
          
         var p=$("<p></p>");

          var iframe = $('<iframe></iframe>', {
			  src:feature.properties['iframe'],  
			         
          });
          
          
          
          
          var container = $('<div></div>', {
            id: 'container' + feature.properties['id'],
            class: 'image-container'
          });

          var imgHolder = $('<div></div>', {
            class: 'img-holder'
          });
   
			immagine=href.html(image);
          imgHolder.append(immagine);
          

          container.append(chapter).append(imgHolder).append(description).append(source).append(p).append(feature.properties['iframe_title']).append(iframe);
          $('#contents').append(container);

          var i;
          var areaTop = -100;
          var areaBottom = 0;

          // Calculating total height of blocks above active
          for (i = 1; i < feature.properties['id']; i++) {
            areaTop += $('div#container' + i).height() + imageContainerMargin;
          }

          areaBottom = areaTop + $('div#container' + feature.properties['id']).height();



          $('div#contents').scroll(function() {
			  
            if ($(this).scrollTop() >= areaTop && $(this).scrollTop() < areaBottom) {
              $('.image-container').removeClass("inFocus").addClass("outFocus");
              $('div#container' + feature.properties['id']).addClass("inFocus").removeClass("outFocus");
			
              map.flyTo([feature.geometry.coordinates[1], feature.geometry.coordinates[0] ], feature.properties['zoom']);
            
            }
          });

          // Make markers clickable
          layer.on('click', function() {
            $("div#contents").animate({scrollTop: areaTop + "px"});
          });

        })(layer, feature.properties);
      }
    });

    $('div#container1').addClass("inFocus");
    $('#contents').append("<div class='space-at-the-bottom'><a href='#space-at-the-top'><i class='fa fa-chevron-up'></i></br><small>Top</small></a></div>");
    map.fitBounds(geojson.getBounds());
    geojson.addTo(map);
  });
}

initMap();

var images = {
    1: [
        {
      href: 'img/1/02.JPG',
      title: 'Capela de Nossa Senhora da Saúde'
    }
    ],
    2: [
         {
      href: "img/2/01.JPG",
      title: "Colégios dos Meninos Órfãos"
    },
    ],
  3: [
    {
      href: "img/3/03.JPG",
      title: "Palácio dos Condes de Figueira"
    }
  ],
  4: [
  
    {
      href: "img/4/01.JPG",
      title: "Convento do Menino-Deus"
    }
  ],
  5: [
         
     {
      href: "img/5/05.JPG",
      title: "Palácio Belmonte"
    }
  ],
  6: [
    {
      href: "img/6/01.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    }

  ],
  7: [
    {
      href: "img/7/01.JPG",
      title: "Igreja de Santa Luzia"
    } 
  ],
  8: [
    {
      href: "img/8/01.JPG",
      title: "Igreja de São Miguel"
    }
  ],
  9: [
    {
      href: "img/9/01.JPG",
      title: "Museu do Fado e da Guitarra"
    }
  ]
};


	$(document).ready(function() {
		$(".open_fancybox").click(function() {
			var id = $(this).attr('id');
    $.fancybox.open(images[id], {
        padding : 0
    });
    
    return false;
});
});

/*
	$(document).ready(function() {
		$(".fancybox").fancybox();

	});*/
