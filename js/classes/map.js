window.gitdMeatMapApp = window.gitdMeatMapApp || {};

(function( app ) {

  'use strict';

  app.map = (function() {

    var map, data, width, height, bars, qtys, gramsLegend,
      valueScale, countryInfoDiv, countryRedmeatDiv, topEatersDiv, topEatersList,
      started = false,
      topEaters = {},
      types = [ 'bovine', 'pig', 'sheep', 'poultry', 'offals', 'other' ],
      activeType = 'redmeat',
      color_zero = '#EEE',
      colors = {
        redmeat: '#393333',
        bovine: '#940413',
        pig: '#C141FF',
        poultry: '#F58D23',
        sheep: '#3FB22C',
        offals: '#0BA8CA',
        other: '#1343A6'
      },
      recommendedIntake = 300 / 7,
      topBarMessages = {
        redmeat: 'Red meat eaters',
        bovine: 'Bovine meat eaters',
        pig: 'Pig meat eaters',
        poultry: 'Poultry eaters',
        sheep: 'Mutton/goat meat eaters',
        offals: 'Offal eaters',
        other: 'Game and other meat eaters',
        favorites: 'Favorite kind of meat'
      },
      sortFunc = function( a, b ) { return b[ 1 ] - a[ 1 ]; };

    function showMap( topology ) {
      d3.select( '#map' ).node().appendChild( topology.documentElement );
      map = d3.select( '#map svg' );
      setupSize();
      data.forEach(function( d ){
        map.selectAll( '[cc=' + d.id + ']' )
          .data( [ d.id ] )
          .on( 'mouseover', showCountryInfo )
          .on( 'touchstart', showCountryInfo )
          .on( 'mouseleave', hideCountryInfo );
      });
      $( '#map' ).trigger( 'mapReady' );
    }

    function setupSize() {
      width = window.innerWidth ;
      height = window.innerHeight - 70;
      $( '#map' ).width( width ).height( height );
      map.attr('width', width)
        .attr('height', height);
    }



    // ----------------- Country Info -----------------

    function showCountryInfo( c ) {

      if ( !started ) return;

      var countryPath = map.selectAll( '[cc=' + c + ']' )[ 0 ][ 0 ],
        totalRedMeat = 0,
        countryData, countryDetailsText,
        i, l,

        getQty = function( d ){
          var q = countryData[ d ] * 1000 / 365;
          return ( ( q > 0 && q < 0.9 )? '<1' : Math.round( q )  );
        };

      map.selectAll( '[cc]' ).attr( 'class', null );
      map.selectAll( '[cc=' + c + ']' ).attr( 'class', 'selected' );

      for ( i = 0, l = data.length; i < l; i++ ) {
        if ( data[ i ].id === c ) {
          countryData = data[ i ];
          totalRedMeat = data[ i ].bovine + data[ i ].pig + data[ i ].sheep;
          break;
        }
      }

      countryInfoDiv.addClass( 'visible' ).find( 'h2' ).text( countryData.name );
      var redmeat = Math.round( totalRedMeat * 1000 / 365 / recommendedIntake * 10 ) / 10;
      countryRedmeatDiv.text( redmeat );
      if ( redmeat > 1 ) {
        countryRedmeatDiv.addClass( 'exceeding' );
      } else {
        countryRedmeatDiv.removeClass( 'exceeding' );
      }

      topEatersDiv.removeClass( 'visible' );

      for ( i = 0; i < types.length; i++ ) {
        qtys.eq( i ).text( getQty( types[ i ] ) );
        bars.eq( i ).css( 'height', valueScale( countryData[ types[ i ] ] ) );
      }
      qtys.show();

      gramsLegend.show();

    }

    function hideCountryInfo() {
      if ( !started ) return;
      countryInfoDiv.removeClass( 'visible' );
      topEatersDiv.addClass( 'visible' );
      qtys.hide();
      bars.css( 'height', 40 );
      map.selectAll( '[cc]' )
        .attr( 'class', null );
      $( '.' + activeType + ' .bar' )
        .css( 'height', 60 );
      gramsLegend.hide();
    }



    // ----------------- Map Coloring -----------------

    function colorizeType() {

      topEatersDiv.addClass( 'visible' )
        .find( 'h2' ).text( topBarMessages[ activeType ] );

      for ( var i = 0; i < 3; i++ ) {
        topEatersList.eq( i ).html( topEaters[ activeType ][ i ][ 0 ] );
      }
      topEatersList.show();

      var min = d3.min( data.map( function( d ) { return d[ activeType ]; } ) ),
        max = d3.max( data.map( function( d ) { return d[ activeType ]; } ) ),
        scale = d3.scale.pow().exponent( 0.7 ).domain( [ min, max ] ).range( [ color_zero, colors[ activeType ] ] );

      for ( i = 0; i < data.length; i++ ) {
        map.selectAll( '[cc=' + data[ i ].id + ']' ).style( 'fill', scale( data[ i ][ activeType ] ) );
      }

    }

    function colorizeFavorites() {

      topEatersDiv.addClass( 'visible' )
        .find( 'h2' ).text( topBarMessages[ activeType ] );
      topEatersList.hide();

      var minValues = [],
        maxValues = [],
        scales = [],
        i,

        getData = function( d ){
          return d[ types[ i ] ];
        },

        getColor = function( d ){
          var values = [],
            normalizedValues = [],
            totalMeat = 0,
            indexMax, j;
          for ( j = 0; j < types.length; j++ ) {
            values.push( d[ types[ j ] ] );
            totalMeat += d[ types[ j ] ];
          }
          indexMax = values.indexOf( Math.max.apply( null, values ) );
          for ( j = 0; j < types.length; j++ ) {
            normalizedValues.push( values[ j ] / totalMeat );
          }
          return scales[ indexMax ]( normalizedValues[ indexMax ] );
        };

      for ( i = 0; i < types.length; i++ ) {
        scales[ i ] = d3.scale.pow().exponent( 0.9 ).domain( [ 0, 0.6 ] ).range( [ color_zero, colors[ types[ i ] ] ] ).clamp( true );
      }

      for ( i = 0; i < data.length; i++ ) {
        map.selectAll( '[cc=' + data[ i ].id + ']' ).style( 'fill', getColor( data[ i ] ) );
      }

    }



    // ----------------- Selection -----------------

    function setActiveType( type ) {
      if ( !started ) return;
      resetMap();
      if ( activeType === type || type === undefined ) {
        activeType = 'redmeat';
        colorizeType();
        return;
      }
      activeType = type;
      $( '.' + activeType + ' .bar' )
        .css( 'height', 60 );
      if ( type === 'favorites' ) {
        colorizeFavorites();
      } else {
        colorizeType();
      }
    }

    function resetMap() {
      countryInfoDiv.removeClass( 'visible' );
      qtys.hide();
      bars.css( 'height', 40 );
      map.selectAll( '[cc]' )
        .attr( 'class', null )
        .style( 'fill', null );
    }



    // ----------------- Intro screen -----------------

    function showIntro() {
      $( '.intro-screen' ).addClass( 'visible' );
    }



    // ----------------- Resize listener -----------------

    var resizeEndTimeout;

    function setupResizeListener() {
      $( window ).on( 'resize', function() {
        clearTimeout( resizeEndTimeout );
        resizeEndTimeout = setTimeout( resize, 500 );
      });
    }

    function resize() {
      setupSize();
    }



    // ----------------- Public Methods -----------------

    return {

      setup: function( d ) {

        data = d;
        setupResizeListener();

        bars = $( '.bar' );
        qtys = $( '.qty' );
        countryInfoDiv = $( '#countryInfo' );
        countryRedmeatDiv = countryInfoDiv.find( 'span' );
        topEatersDiv = $( '#topEaters' );
        topEatersList = topEatersDiv.find( 'li' );
        gramsLegend = $( '.legend-grams' );

        $( '.bovine' ).on( 'click', function(){ setActiveType( 'bovine' ); } );
        $( '.pig' ).on( 'click', function(){ setActiveType( 'pig' ); } );
        $( '.poultry' ).on( 'click', function(){ setActiveType( 'poultry' ); } );
        $( '.sheep' ).on( 'click', function(){ setActiveType( 'sheep' ); } );
        $( '.offals' ).on( 'click', function(){ setActiveType( 'offals' ); } );
        $( '.other' ).on( 'click', function(){ setActiveType( 'other' ); } );
        $( '.favorites' ).on( 'click', function(){ setActiveType( 'favorites' ); } );
        $( '.legend-redmeat' ).on( 'click', function(){ setActiveType( 'redmeat' ); } );

        $( '.helpbtn' ).on( 'click', showIntro );

        for ( var i = 0; i < types.length; i++ ) {
          var el = $( '.' + types[ i ] );
          el.find( '.bar' ).css( 'background-color', colors[ types[ i ] ] );
          el.find( '.qty' ).css( 'color', colors[ types[ i ] ] );
        }

        // Total meat

        topEaters.redmeat = [];
        for ( var c in data ) {
          var total = 0;
          total = data[ c ].bovine + data[ c ].pig + data[ c ].sheep;
          data[ c ].redmeat = total;
          topEaters.redmeat.push( [ data[ c ].name, total ] );
        }
        topEaters.redmeat.sort( sortFunc );

        // Top eaters

        var highestValuePerType = [],
          highestValue;

        for ( i = 0; i < types.length; i++ ) {
          topEaters[ types[ i ] ] = [];
          for ( c in data ) {
            topEaters[ types[ i ] ].push( [ data[ c ].name, data[ c ][ types[ i ] ] ] );
          }
          topEaters[ types[ i ] ].sort( sortFunc );
          highestValuePerType[ i ] = topEaters[ types[ i ] ][ 0 ][ 1 ];
        }
        highestValue = Math.ceil( Math.max.apply( null, highestValuePerType ) );
        valueScale = d3.scale.linear().domain( [ 0, highestValue ] ).range( [ 0, 150 ] );

        d3.xml( 'map/worldmap.svg', 'image/svg+xml', showMap );

      },

      show: function() {
        if ( started ) return;
        started = true;
        $( '.navBar' ).addClass( 'visible' );
        setTimeout( setActiveType, 400 );
      }

    };

  })();

})( window.gitdMeatMapApp );