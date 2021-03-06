require(['jquery', 'YSDRemoteDataSource','YSDSelectSelector','/js/common.js',
	     'jquery.validate', 'jquery.ui', 'jquery.ui.datepicker-es', 
	     'jquery.ui.datepicker.validation', 'datejs', 
	     'jquery.uniform'], 
	     function($, RemoteDataSource, SelectSelector,commonServices) {

  selectorModel = {
    minDays   : 1,
  };

  selectorController = {

    dateFromChanged: function() {

      var dateFrom = $('#date_from').datepicker('getDate');
      var dateTo = $('#date_from').datepicker('getDate');
      dateTo.setDate(dateTo.getDate() + selectorModel.minDays)
      $('#date_to').datepicker('setDate', dateTo );
      $('#date_to').datepicker('option', 'minDate', dateFrom.add(selectorModel.minDays).days());

    }

  };

  selectorView = {

  	init: function() {

  		this.setupDateControls();
  		this.loadPickupReturnPlaces();
  		this.loadPickupReturnTime();

  	},

  	setupDateControls: function() {
      
      $.datepicker.setDefaults( $.datepicker.regional["<%=session[:locale] || 'es'%>" ] );
      var locale = $.datepicker.regional["<%=session[:locale] || 'es'%>"];

      $('#date_from').datepicker({numberOfMonths:1, 
          minDate: new Date(), 
          maxDate: new Date().add(365).days(), 
          dateFormat: 'dd/mm/yy',
          firstDay: 1}, 
          locale);
      $('#date_from').datepicker('setDate', '+0'); 

      $('#date_to').datepicker({numberOfMonths:1, 
          minDate: new Date().add(selectorModel.minDays).days(),
            maxDate: new Date().add(365).days(), 
            dateFormat: 'dd/mm/yy'}, locale);
      $('#date_to').datepicker('setDate', '+'+selectorModel.minDays);

      $('#date_from').bind('change', function() {
           selectorController.dateFromChanged();
         });

  	},

  	loadPickupReturnPlaces: function() {

        var dataSourcePickupPlaces = new RemoteDataSource(commonServices.URL_PREFIX + '/api/booking/frontend/pickup-places',{'id':'name','description':'name'});
        var pickupPlace = new SelectSelector('pickup_place', 
        		dataSourcePickupPlaces, null, false, '',
                function() { 
                    $.uniform.update('#pickup_place');
                } );             

        var dataSourceReturnPlaces = new RemoteDataSource(commonServices.URL_PREFIX + '/api/booking/frontend/return-places',{'id':'name','description':'name'});
        var returnPlace = new SelectSelector('return_place', 
        		dataSourcePickupPlaces, null, false, '',
                function() {

                    $.uniform.update('#return_place'); 

                } );          

  	},

  	loadPickupReturnTime: function() {

        var dataSourcePickupReturnTime = new RemoteDataSource(commonServices.URL_PREFIX + '/api/booking/frontend/pickup-return-times', {
        	  id: function(data){return data;}, 
        	  description: function(data){return data;} });

        var pickupTime = new SelectSelector('time_from', 
        		dataSourcePickupReturnTime, '10:00', false, '',
                function() {
                   
					          $('#time_from').val('10:00');
                    $.uniform.update('#time_from'); 


                } );             
        var returnTime = new SelectSelector('time_to', 
        		dataSourcePickupReturnTime, '10:00', false, '',
                function() {
                
					          $('#time_to').val('10:00');
                    $.uniform.update('#time_to'); 
               	 
                } );  

  	}

  };

  selectorView.init();

});