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
    },
        {
      href: "img/1/03.JPG",
      title: "Capela de Nossa Senhora da Saúde"
    },
        {
      href: "img/1/04.JPG",
      title: "Capela de Nossa Senhora da Saúde"
    },
        {
      href: "img/1/01.JPG",
      title: "Capela de Nossa Senhora da Saúde"
    }
    ,
        {
      href: "img/1/05.JPG",
      title: "Capela de Nossa Senhora da Saúde"
    },
        {
      href: "img/1/06.JPG",
      title: "Capela de Nossa Senhora da Saúde"
    }
    ],
    2: [
         {
      href: "img/2/01.JPG",
      title: "Colégios dos Meninos Órfãos"
    },
        {
      href: "img/2/02.JPG",
      title: "Colégios dos Meninos Órfãos"
    },
        {
      href: "img/2/03.JPG",
      title: "Colégios dos Meninos Órfãos"
    },
        {
      href: "img/2/04.JPG",
      title: "Colégios dos Meninos Órfãos"
    },
        {
      href: "img/2/05.JPG",
      title: "Colégios dos Meninos Órfãos"
    }
    ,        {
      href: "img/2/06.JPG",
      title: "Colégios dos Meninos Órfãos"
    }
    ,        {
      href: "img/2/07.JPG",
      title: "Colégios dos Meninos Órfãos"
    }
    ,        {
      href: "img/2/08.JPG",
      title: "Colégios dos Meninos Órfãos"
    }
    ,        {
      href: "img/2/09.JPG",
      title: "Colégios dos Meninos Órfãos"
    }
    ,        {
      href: "img/2/10.JPG",
      title: "Colégios dos Meninos Órfãos"
    }
    ,        {
      href: "img/2/11.JPG",
      title: "Colégios dos Meninos Órfãos"
    }
    ,        {
      href: "img/2/12.JPG",
      title: "Colégios dos Meninos Órfãos"
    }
    ,        {
      href: "img/2/13.JPG",
      title: "Colégios dos Meninos Órfãos"
    }
    ,        {
      href: "img/2/14.JPG",
      title: "Colégios dos Meninos Órfãos"
    }
    ,        {
      href: "img/2/15.JPG",
      title: "Colégios dos Meninos Órfãos"
    }
    ,        {
      href: "img/2/16.JPG",
      title: "Colégios dos Meninos Órfãos"
    }
    ,        {
      href: "img/2/17.JPG",
      title: "Colégios dos Meninos Órfãos"
    }
    ,        {
      href: "img/2/18.JPG",
      title: "Colégios dos Meninos Órfãos"
    }
    ,        {
      href: "img/2/19.JPG",
      title: "Colégios dos Meninos Órfãos"
    }
    ,        {
      href: "img/2/20.JPG",
      title: "Colégios dos Meninos Órfãos"
    }
    ,        {
      href: "img/2/21.JPG",
      title: "Colégios dos Meninos Órfãos"
    }
    ,        {
      href: "img/2/22.JPG",
      title: "Colégios dos Meninos Órfãos"
    }
    ,        {
      href: "img/2/23.JPG",
      title: "Colégios dos Meninos Órfãos"
    }
    ,        {
      href: "img/2/24.JPG",
      title: "Colégios dos Meninos Órfãos"
    }
    ,        {
      href: "img/2/25.JPG",
      title: "Colégios dos Meninos Órfãos"
    },        {
      href: "img/2/26.JPG",
      title: "Colégios dos Meninos Órfãos"
    },        {
      href: "img/2/27.JPG",
      title: "Rua do Capelão"
    },        {
      href: "img/2/28.JPG",
      title: "Rua do Capelão"
    },        {
      href: "img/2/29.JPG",
      title: "Rua do Capelão"
    },        {
      href: "img/2/30.JPG",
      title: "Rua do Capelão"
    },        {
      href: "img/2/31.JPG",
      title: "Rua do Capelão"
    },        {
      href: "img/2/32.JPG",
      title: "Rua do Capelão"
    },        {
      href: "img/2/33.JPG",
      title: "Rua do Capelão"
    },        {
      href: "img/2/34.JPG",
      title: "Rua do Capelão"
    },        {
      href: "img/2/35.JPG",
      title: "Rua do Capelão"
    },        {
      href: "img/2/36.JPG",
      title: "Rua do Capelão"
    },        {
      href: "img/2/37.JPG",
      title: "Rua do Capelão"
    },        {
      href: "img/2/38.JPG",
      title: "Largo da Severa"
    },        {
      href: "img/2/39.JPG",
      title: "Largo da Severa"
    },        {
      href: "img/2/40.JPG",
      title: "Largo da Severa"
    },        {
      href: "img/2/41.JPG",
      title: "Largo da Severa"
    },        {
      href: "img/2/42.JPG",
      title: "Largo da Severa"
    },        {
      href: "img/2/43.JPG",
      title: "Largo da Severa"
    },        {
      href: "img/2/44.JPG",
      title: "Mouraria"
    },        {
      href: "img/2/45.JPG",
      title: "Mouraria"
    },        {
      href: "img/2/46.JPG",
      title: "Mouraria"
    },        {
      href: "img/2/47.JPG",
      title: "Mouraria"
    },        {
      href: "img/2/48.JPG",
      title: "Mouraria"
    },        {
      href: "img/2/49.JPG",
      title: "Mouraria"
    },        {
      href: "img/2/50.JPG",
      title: "Mouraria"
    },        {
      href: "img/2/51.JPG",
      title: "Mouraria"
    },        {
      href: "img/2/52.JPG",
      title: "Mouraria"
    },        {
      href: "img/2/53.JPG",
      title: "Calçada de Santo André"
    },        {
      href: "img/2/54.JPG",
      title: "Calçada de Santo André"
    },        {
      href: "img/2/55.JPG",
      title: "Calçada de Santo André"
    },        {
      href: "img/2/56.JPG",
      title: "Calçada de Santo André"
    },        {
      href: "img/2/57.JPG",
      title: "Calçada de Santo André"
    },        {
      href: "img/2/58.JPG",
      title: "Colégios dos Meninos Órfãos"
    },        {
      href: "img/2/59.JPG",
      title: "Calçada de Santo André"
    }
    ],
  3: [
    {
      href: "img/3/03.JPG",
      title: "Palácio dos Condes de Figueira"
    },
        {
      href: "img/3/02.JPG",
      title: "Palácio dos Condes de Figueira"
    },
        {
      href: "img/3/01.JPG",
      title: "Palácio dos Condes de Figueira"
    },
        {
      href: "img/3/04.JPG",
     title: "Palácio dos Condes de Figueira"
    },
        {
      href: "img/3/05.JPG",
      title: "Palácio dos Condes de Figueira"
    },
        {
     href: "img/3/06.JPG",
      title: "Palácio dos Condes de Figueira"
    },
        {
      href: "img/3/07.JPG",
      title: "Palácio dos Condes de Figueira"
    },
        {
      href: "img/3/08.JPG",
      title: "Palácio dos Condes de Figueira"
    }
  ],
  4: [
     {
          href: "img/4/12.JPG",
      title: "Convento do Menino-Deus"
    },
    {
      href: "img/4/01.JPG",
      title: "Convento do Menino-Deus"
    },
        {
          href: "img/4/02.JPG",
      "title": "Convento do Menino-Deus"
    },
        {
          href: "img/4/03.JPG",
      title: "Convento do Menino-Deus"
    },
    {
          href: "img/4/04.JPG",
      title: "Convento do Menino-Deus"
    },
    {
          href: "img/4/05.JPG",
      title: "Convento do Menino-Deus"
    },
        {
          href: "img/4/06.JPG",
      title: "Convento do Menino-Deus"
    },
        {
          href: "img/4/07.JPG",
      title: "Convento do Menino-Deus"
    },
        {
          href: "img/4/08.JPG",
      title: "Convento do Menino-Deus"
    },
        {
          href: "img/4/10.JPG",
      title: "Convento do Menino-Deus"
    },       {
          href: "img/4/11.JPG",
      title: "Convento do Menino-Deus"
    }   
  ],
  5: [
          {
      href: "img/5/01.JPG",
      title: "Palácio Belmonte"
    },
        {
      href: "img/5/03.JPG",
      title: "Palácio Belmonte"
    },
        {
      href: "img/5/04.JPG",
      title: "Palácio Belmonte"
    },   
     {
      href: "img/5/05.JPG",
      title: "Palácio Belmonte"
    },
        {
      href: "img/5/02.JPG",
      title: "Palácio Belmonte"
    },
        {
      href: "img/5/06.JPG",
      title: "Palácio Belmonte"
    },
        {
      href: "img/5/07.JPG",
      title: "Palácio Belmonte"
    },
        {
      href: "img/5/08.JPG",
      title: "Palácio Belmonte"
    },
        {
      href: "img/5/09.JPG",
      title: "Palácio Belmonte"
    },
        {
      href: "img/5/10.JPG",
      title: "Palácio Belmonte"
    },
        {
      href: "img/5/11.JPG",
      title: "Palácio Belmonte"
    },
        {
      href: "img/5/12.JPG",
      title: "Palácio Belmonte"
    },
        {
      href: "img/5/13.JPG",
      title: "Palácio Belmonte"
    },
            {
      href: "img/5/14.JPG",
      title: "Palácio Belmonte"
    },
  ],
  6: [
    {
      href: "img/6/01.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
       {
      href: "img/6/02.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
       {
      href: "img/6/03.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
       {
      href: "img/6/04.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
       {
      href: "img/6/05.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
       {
      href: "img/6/06.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
       {
      href: "img/6/07.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
       {
      href: "img/6/08.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
       {
      href: "img/6/09.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
       {
      href: "img/6/10.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
       {
      href: "img/6/11.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
       {
      href: "img/6/12.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
       {
      href: "img/6/13.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
       {
      href: "img/6/14.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
       {
      href: "img/6/15.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
           {
      href: "img/6/16.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
           {
      href: "img/6/17.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
           {
      href: "img/6/18.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
           {
      href: "img/6/19.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
           {
      href: "img/6/20.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
           {
      href: "img/6/15.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
           {
      href: "img/6/21.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
           {
      href: "img/6/22.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
        {  href: "img/6/23.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
        {  href: "img/6/24.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
        {  href: "img/6/25.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
        {  href: "img/6/26.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
        {  href: "img/6/27.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
        {  href: "img/6/28.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
         { href: "img/6/29.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
          {href: "img/6/30.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
         { href: "img/6/31.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
          {    href: "img/6/32.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },
           {   href: "img/6/33.JPG",
      title: "Museu de Artes Decorativas - Palácio Azurara"
    },

  ],
  7: [
    {
      href: "img/7/01.JPG",
      title: "Igreja de Santa Luzia"
    },
     {
      href: "img/7/02.JPG",
      title: "Igreja de Santa Luzia"
    },
    {
      href: "img/7/03.JPG",
      title: "Igreja de Santa Luzia"
    },
    {
      href: "img/7/04.JPG",
      title: "Igreja de Santa Luzia"
    },
    {
      href: "img/7/05.JPG",
      title: "Igreja de Santa Luzia"
    },
    {
      href: "img/7/06.JPG",
      title: "Igreja de Santa Luzia"
    },
    {
      href: "img/7/07.JPG",
      title: "Igreja de Santa Luzia"
    },
    {
      href: "img/7/08.JPG",
      title: "Igreja de Santa Luzia"
    },
    {
      href: "img/7/09.JPG",
      title: "Igreja de Santa Luzia"
    },
    {
      href: "img/7/10.JPG",
      title: "Igreja de Santa Luzia"
    },
    {
      href: "img/7/11.JPG",
      title: "Igreja de Santa Luzia"
    },
    {
      href: "img/7/12.JPG",
      title: "Igreja de Santa Luzia"
    },
    {
      href: "img/7/13.JPG",
      title: "Igreja de Santa Luzia"
    },
    {
      href: "img/7/14.JPG",
      title: "Igreja de Santa Luzia"
    },
    {
      href: "img/7/15.JPG",
      title: "Igreja de Santa Luzia"
    },
    {
      href: "img/7/16.JPG",
      title: "Igreja de Santa Luzia"
    },
    {
      href: "img/7/17.JPG",
      title: "Igreja de Santa Luzia"
    },
    {
      href: "img/7/18.JPG",
      title: "Igreja de Santa Luzia"
    },
    {
      href: "img/7/19.JPG",
      title: "Igreja de Santa Luzia"
    },
    {
      href: "img/7/20.JPG",
      title: "Igreja de Santa Luzia"
    },
    {
      href: "img/7/21.JPG",
      title: "Igreja de Santa Luzia"
    },
    {
      href: "img/7/22.JPG",
      title: "Igreja de Santa Luzia"
    },
    {
      href: "img/7/23.JPG",
      title: "Igreja de Santa Luzia"
    },
    {
      href: "img/7/24.JPG",
      title: "Igreja de Santa Luzia"
    },
    {
      href: "img/7/25.JPG",
      title: "Igreja de Santa Luzia"
    },  
        {
      href: "img/7/26.JPG",
      title: "Igreja de Santa Luzia"
    }  
  ],
  8: [
    {
      href: "img/8/01.JPG",
      title: "Igreja de São Miguel"
    },
        {
      href: "img/8/02.JPG",
      title: "Cerca Moura"
    }, {
      href: "img/8/03.JPG",
      title: "Rua Norberto de Araújo"
    }, {
      href: "img/8/04.JPG",
      title: "Rua Norberto de Araújo"
    }, {
      href: "img/8/05.JPG",
      title: "Rua Norberto de Araújo"
    }, {
      href: "img/8/06.JPG",
      title: "Rua Norberto de Araújo"
    }, {
      href: "img/8/07.JPG",
      title: "Rua Norberto de Araújo"
    }, {
      href: "img/8/08.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/09.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/09.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/10.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/11.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/12.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/14.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/15.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/16.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/17.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/18.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/20.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/21.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/22.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/23.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/24.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/25.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/26.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/27.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/28.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/29.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/30.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/31.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/32.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/33.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/34.JPG",
      title: "Igreja de São Miguel"
    }, {
      href: "img/8/35.JPG",
      title: "Festa de Santo Antonio"
    }, {
      href: "img/8/36.JPG",
      title: "Festa de Santo Antonio"
    },
  ],
  9: [
    {
      href: "img/9/01.JPG",
      title: "Museu do Fado e da Guitarra"
    },
        {
      href: "img/9/02.JPG",
      title: "Museu do Fado e da Guitarra"
    },
        {
      href: "img/9/03.JPG",
      title: "Museu do Fado e da Guitarra"
    },
        {
      href: "img/9/04.JPG",
      title: "Museu do Fado e da Guitarra"
    },
        {
      href: "img/9/05.JPG",
      title: "Museu do Fado e da Guitarra"
    },
        {
      href: "img/9/06.JPG",
      title: "Museu do Fado e da Guitarra"
    },
        {
      href: "img/9/07.JPG",
      title: "Museu do Fado e da Guitarra"
    },
        {
      href: "img/9/08.JPG",
      title: "Museu do Fado e da Guitarra"
    }, {
      href: "img/9/09.JPG",
      title: "Tejo"
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
