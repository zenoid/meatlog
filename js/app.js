window.gitdMeatMapApp = window.gitdMeatMapApp || {};

(function( app ) {

  'use strict';

  app.main = (function() {

    return {

      init: function( d ) {

        app.map.setup( d );
        $( '#map' ).on( 'mapReady', function() {
          $( '.spinner' ).remove();
          $( '.intro-screen' ).addClass( 'visible' );
          $( '.intro-screen .btn' ).on( 'click', function() {
            $( '.intro-screen' ).removeClass( 'visible' );
            app.map.show();
          });
        });

      },

    };

  })();



  // ----------------- Utilities -----------------

  function fixTouchEvents() {

    FastClick.attach( document.body );

    $( document ).on( 'touchmove', function( e ) {
      e.preventDefault();
    });

  }



  // ----------------- Data Loading and Startup -----------------

  $( document ).ready( function() {

    fixTouchEvents();

    d3.csv( 'data/meat-per-country.csv', function( data ) {

      var parsedData = [], countryData;
      data.map(function( d ) {
        countryData = {};
        for ( var p in d ) {
          countryData[ p ] = ( p !== 'name' && p !== 'id' )? +d[ p ] : d[ p ];
        }
        parsedData.push( countryData );
      });

      app.main.init( parsedData );

    });

  });

})( window.gitdMeatMapApp );