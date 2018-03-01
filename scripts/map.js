 var map;
 var markers = [];
 var locationsBU=[]; 

 // to add new marker
 function addMapMarkers(locations,isFromSearch) {

var infowindow = new google.maps.InfoWindow();
	
	
	for (i = 0; i < locations.length; i++) {  
    marker = new google.maps.Marker({
         position: new google.maps.LatLng(locations[i].lat, locations[i].Lng),
		 animation: (isFromSearch===true)? google.maps.Animation.DROP:"",
		 label:locations[i].label,
         map: map
    });
	markers.push(marker);
    addMakerListner(marker,i,locations[i],infowindow)
    
}
   
}

// to add  listener to marker so when ckick marker will show windows info
function addMakerListner(marker,index,locationsObj,infowindow)
{
	google.maps.event.addListener(marker, 'click', (function(marker, index) {
		var self = marker;
         return function() {
            getVenueDetails(locationsObj, function(windowContent){
        // including content to the Info Window.
        infowindow.setContent(windowContent);
        
        // opening the Info Window in the current map and at the current marker location.
        infowindow.open(map, self);
      });
         };
    })(marker, index));
	
}
 

  // to fill or delete markers base on search 
 function fillmarkerBySearch(markers,location,searchLocation,showAll)
 {
	 var locations=[];
	 if(showAll)
	 {
		 
		 locations=locationsBU;
		 addMapMarkers(locations,false);
	 }
	 else
	 {
		 locations.push(location);
		 addMapMarkers(locations,true);
	 }
 }
 
 // for knockjs search and search in google map marker
 function searchforLoaction(locations,isInit)
 {
	  var viewModel = {
		  
        query: ko.observable(''),
		selectItem: function(event) {
		 var retObj = $.grep(markers, function(obj){
			 
			 return obj.label == event.label;
			 
			 });
         google.maps.event.trigger(retObj, 'click');
    } 
    };

	
    viewModel.locations = ko.dependentObservable(function() {
        var search = this.query().toLowerCase();
		clearMarkers();
		markers=[];
        return ko.utils.arrayFilter(locations, function(location) {
			
			if(search==="")
			{
				fillmarkerBySearch(markers,null,searchLocation,true);
			}
		    else 
			{
				var searchLocationExist = location.title.toLowerCase().indexOf(search) >= 0?true:false;
				if(searchLocationExist===true)
				{
				fillmarkerBySearch(markers,location,searchLocationExist,false);
				}
			}
            var searchLocation = location.title.toLowerCase().indexOf(search) > 0;
			return location.title.toLowerCase().indexOf(search) >= 0;
        });
    }, viewModel);

    ko.applyBindings(viewModel);
 }
 
 // to inite map and show it to end user
 function initMap() {
	 
	 locationsBU = [
	{title:"Tamimi Market",lat:"24.700872",Lng:"46.695489", id:"1",label:"A"},
    {title:"Golden Brown",lat:"24.705668",Lng:"46.705606", id:"2",label:"B"},
    {title:"Hashem Contracting & Trading Corp.",lat:"24.710807",Lng:"46.691127", id:"3",label:"C"},
	{title:"Johnson Controls- riyadh",lat:"24.697368",Lng:"46.686724",  id:"4",label:"D"},
	{title:"BurgerFuel",lat:"24.697368",Lng:"46.693838",  id:"5",label:"E"}
    ];
       
        var uluru = {lat: 24.700178, lng: 46.692740};
         map = new google.maps.Map(document.getElementById('map'), {
          zoom: 14,
          center: uluru
        });
        var locations=[];
		locations=locationsBU;
		
		// to set markers on map after inite it
        addMapMarkers(locations,false);
		
		// to inite search for locations
		searchforLoaction(locations,true);
      }
	  
	  // Sets the map on all markers in the array.
      function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

      // Removes the markers from the map, but keeps them in the array.
      function clearMarkers() {
        setMapOnAll(null);
      }
	  
	  	  /*========= Foursquare API ===========*/
var baseUrl = 'https://api.foursquare.com/v2/venues/search?',
    clientId = 'NYNEUWENKWKWG5USW0BB4DN5YQGIJZ3PWD0RPXRR420SVGQC',
    clientSecret = 'SQXLZDD5TIOALZLHPBYMUUQ05DOVPTJRGKK2AP1LDU14YHPD';

	// to get the details of avenu from road map
function getVenueDetails(locationInfo, infoWindowCallback) {
  foursquareUrl = baseUrl + '&client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20161207&query='+locationInfo.title+'&ll=24.696759,46.702842';
  
   $.ajax({
        type: "GET",
        url: foursquareUrl,
        success: function (data) {
   var venue = data.response.venues[0];
    var placeName = venue.name;
    var placeAddress = venue.location.formattedAddress;
    var placePhonenos = (venue.contact.formattedPhone === undefined)? 'None': venue.contact.formattedPhone;
    windowContent = '<div id="iw_container"><p><strong>Name: </strong>' + placeName + '</p>' +
                    '<p><strong>Address: </strong>  ' + placeAddress + '</p>' +
                    '<p><strong>Phone: </strong>' + placePhonenos + '</p></div>';
    infoWindowCallback(windowContent);
        },
		error:function(error){
      windowContent = 'Fail to connect to data source';
      infoWindowCallback(windowContent);
    }
		
    });
  
  
}

// Create an alert if Google Maps doesn't respond
function mapError() {
    alert("Google Map is not responding. Check your connection or come back later.");
}
	  
	  
	  