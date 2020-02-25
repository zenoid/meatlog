
var fs = require( 'fs' ),
  finalData = {},
  destFile,

  countriesNames = [ [ 'af',  'afghanistan' ], [ 'ax',  'åland islands' ], [ 'al',  'albania' ], [ 'dz',  'algeria' ], [ 'as',  'american samoa' ], [ 'ad',  'andorra' ], [ 'ao',  'angola' ], [ 'ai',  'anguilla' ], [ 'aq',  'antarctica' ], [ 'ag',  'antigua and barbuda' ], [ 'ar',  'argentina' ], [ 'am',  'armenia' ], [ 'aw',  'aruba' ], [ 'au',  'australia' ], [ 'at',  'austria' ], [ 'az',  'azerbaijan' ], [ 'bs',  'bahamas' ], [ 'bh',  'bahrain' ], [ 'bd',  'bangladesh' ], [ 'bb',  'barbados' ], [ 'by',  'belarus' ], [ 'be',  'belgium' ], [ 'bz',  'belize' ], [ 'bj',  'benin' ], [ 'bm',  'bermuda' ], [ 'bt',  'bhutan' ], [ 'bo',  'bolivia' ], [ 'bq',  'bonaire, sint eustatius and saba' ], [ 'ba',  'bosnia and herzegovina' ], [ 'bw',  'botswana' ], [ 'bv',  'bouvet island' ], [ 'br',  'brazil' ], [ 'io',  'british indian ocean territory' ], [ 'bn',  'brunei darussalam' ], [ 'bg',  'bulgaria' ], [ 'bf',  'burkina faso' ], [ 'bi',  'burundi' ], [ 'kh',  'cambodia' ], [ 'cm',  'cameroon' ], [ 'ca',  'canada' ], [ 'cv',  'cabo verde' ], [ 'ky',  'cayman islands' ], [ 'cf',  'central african republic' ], [ 'td',  'chad' ], [ 'cl',  'chile' ], [ 'cn',  'china' ], [ 'cx',  'christmas island' ], [ 'cc',  'cocos (keeling) islands' ], [ 'co',  'colombia' ], [ 'km',  'comoros' ], [ 'cg',  'congo, republic of the' ], [ 'cd',  'congo' ], [ 'ck',  'cook islands' ], [ 'cr',  'costa rica' ], [ 'ci',  'cote d\'ivoire' ], [ 'hr',  'croatia' ], [ 'cu',  'cuba' ], [ 'cw',  'curaçao' ], [ 'cy',  'cyprus' ], [ 'cz',  'czech republic' ], [ 'dk',  'denmark' ], [ 'dj',  'djibouti' ], [ 'dm',  'dominica' ], [ 'do',  'dominican republic' ], [ 'ec',  'ecuador' ], [ 'eg',  'egypt' ], [ 'sv',  'el salvador' ], [ 'gq',  'equatorial guinea' ], [ 'er',  'eritrea' ], [ 'ee',  'estonia' ], [ 'et',  'ethiopia' ], [ 'fk',  'falkland islands (malvinas)' ], [ 'fo',  'faroe islands' ], [ 'fj',  'fiji' ], [ 'fi',  'finland' ], [ 'fr',  'france' ], [ 'gf',  'french guiana' ], [ 'pf',  'french polynesia' ], [ 'tf',  'french southern territories' ], [ 'ga',  'gabon' ], [ 'gm',  'gambia' ], [ 'ge',  'georgia' ], [ 'de',  'germany' ], [ 'gh',  'ghana' ], [ 'gi',  'gibraltar' ], [ 'gr',  'greece' ], [ 'gl',  'greenland' ], [ 'gd',  'grenada' ], [ 'gp',  'guadeloupe' ], [ 'gu',  'guam' ], [ 'gt',  'guatemala' ], [ 'gg',  'guernsey' ], [ 'gn',  'guinea' ], [ 'gw',  'guinea-bissau' ], [ 'gy',  'guyana' ], [ 'ht',  'haiti' ], [ 'hm',  'heard island and mcdonald islands' ], [ 'va',  'holy see (vatican city state)' ], [ 'hn',  'honduras' ], [ 'hk',  'hong kong' ], [ 'hu',  'hungary' ], [ 'is',  'iceland' ], [ 'in',  'india' ], [ 'id',  'indonesia' ], [ 'ir',  'iran' ], [ 'iq',  'iraq' ], [ 'ie',  'ireland' ], [ 'im',  'isle of man' ], [ 'il',  'israel' ], [ 'it',  'italy' ], [ 'jm',  'jamaica' ], [ 'jp',  'japan' ], [ 'je',  'jersey' ], [ 'jo',  'jordan' ], [ 'kz',  'kazakhstan' ], [ 'ke',  'kenya' ], [ 'ki',  'kiribati' ], [ 'kp',  'north korea' ], [ 'kr',  'south korea' ], [ 'kw',  'kuwait' ], [ 'kg',  'kyrgyzstan' ], [ 'la',  'laos' ], [ 'lv',  'latvia' ], [ 'lb',  'lebanon' ], [ 'ls',  'lesotho' ], [ 'lr',  'liberia' ], [ 'ly',  'libya' ], [ 'li',  'liechtenstein' ], [ 'lt',  'lithuania' ], [ 'lu',  'luxembourg' ], [ 'mo',  'macao' ], [ 'mk',  'macedonia' ], [ 'mg',  'madagascar' ], [ 'mw',  'malawi' ], [ 'my',  'malaysia' ], [ 'mv',  'maldives' ], [ 'ml',  'mali' ], [ 'mt',  'malta' ], [ 'mh',  'marshall islands' ], [ 'mq',  'martinique' ], [ 'mr',  'mauritania' ], [ 'mu',  'mauritius' ], [ 'yt',  'mayotte' ], [ 'mx',  'mexico' ], [ 'fm',  'micronesia, federated states of' ], [ 'md',  'moldova' ], [ 'mc',  'monaco' ], [ 'mn',  'mongolia' ], [ 'me',  'montenegro' ], [ 'ms',  'montserrat' ], [ 'ma',  'morocco' ], [ 'mz',  'mozambique' ], [ 'mm',  'myanmar' ], [ 'na',  'namibia' ], [ 'nr',  'nauru' ], [ 'np',  'nepal' ], [ 'nl',  'netherlands' ], [ 'nc',  'new caledonia' ], [ 'nz',  'new zealand' ], [ 'ni',  'nicaragua' ], [ 'ne',  'niger' ], [ 'ng',  'nigeria' ], [ 'nu',  'niue' ], [ 'nf',  'norfolk island' ], [ 'mp',  'northern mariana islands' ], [ 'no',  'norway' ], [ 'om',  'oman' ], [ 'pk',  'pakistan' ], [ 'pw',  'palau' ], [ 'ps',  'palestine, state of' ], [ 'pa',  'panama' ], [ 'pg',  'papua new guinea' ], [ 'py',  'paraguay' ], [ 'pe',  'peru' ], [ 'ph',  'philippines' ], [ 'pn',  'pitcairn' ], [ 'pl',  'poland' ], [ 'pt',  'portugal' ], [ 'pr',  'puerto rico' ], [ 'qa',  'qatar' ], [ 're',  'réunion' ], [ 'ro',  'romania' ], [ 'ru',  'russian federation' ], [ 'rw',  'rwanda' ], [ 'bl',  'saint barthélemy' ], [ 'sh',  'saint helena, ascension and tristan da cunha' ], [ 'kn',  'saint kitts and nevis' ], [ 'lc',  'saint lucia' ], [ 'mf',  'saint martin (french part)' ], [ 'pm',  'saint pierre and miquelon' ], [ 'vc',  'saint vincent and the grenadines' ], [ 'ws',  'samoa' ], [ 'sm',  'san marino' ], [ 'st',  'sao tome and principe' ], [ 'sa',  'saudi arabia' ], [ 'sn',  'senegal' ], [ 'rs',  'serbia' ], [ 'sc',  'seychelles' ], [ 'sl',  'sierra leone' ], [ 'sg',  'singapore' ], [ 'sx',  'sint maarten (dutch part)' ], [ 'sk',  'slovakia' ], [ 'si',  'slovenia' ], [ 'sb',  'solomon islands' ], [ 'so',  'somalia' ], [ 'za',  'south africa' ], [ 'gs',  'south georgia and the south sandwich islands' ], [ 'ss',  'south sudan' ], [ 'es',  'spain' ], [ 'lk',  'sri lanka' ], [ 'sd',  'sudan' ], [ 'sr',  'suriname' ], [ 'sj',  'svalbard and jan mayen' ], [ 'sz',  'swaziland' ], [ 'se',  'sweden' ], [ 'ch',  'switzerland' ], [ 'sy',  'syria' ], [ 'tw',  'taiwan' ], [ 'tj',  'tajikistan' ], [ 'tz',  'tanzania' ], [ 'th',  'thailand' ], [ 'tl',  'timor-leste' ], [ 'tg',  'togo' ], [ 'tk',  'tokelau' ], [ 'to',  'tonga' ], [ 'tt',  'trinidad and tobago' ], [ 'tn',  'tunisia' ], [ 'tr',  'turkey' ], [ 'tm',  'turkmenistan' ], [ 'tc',  'turks and caicos islands' ], [ 'tv',  'tuvalu' ], [ 'ug',  'uganda' ], [ 'ua',  'ukraine' ], [ 'ae',  'united arab emirates' ], [ 'gb',  'united kingdom' ], [ 'us',  'united states' ], [ 'um',  'united states minor outlying islands' ], [ 'uy',  'uruguay' ], [ 'uz',  'uzbekistan' ], [ 'vu',  'vanuatu' ], [ 've',  'venezuela' ], [ 'vn',  'vietnam' ], [ 'vg',  'virgin islands, british' ], [ 'vi',  'virgin islands, u.s.' ], [ 'wf',  'wallis and futuna' ], [ 'eh',  'western sahara' ], [ 'ye',  'yemen' ], [ 'zm',  'zambia' ], [ 'zw',  'zimbabwe' ] ],

  meatCodes = {
    2731: { label: 'Bovine meat', code: 'bovine' },
    2733: { label: 'Pig meat', code: 'pig' },
    2734: { label: 'Poultry', code: 'poultry' },
    2732: { label: 'Mutton and Goat meat', code: 'sheep' },
    2736: { label: 'Offals', code: 'offals' },
    2735: { label: 'Other', code: 'other' }
  };



// ---------- Parse CSV data ----------

function parseCSV( sourceFileData ){

  sourceFileData = sourceFileData.toLowerCase();

  var entries = sourceFileData.split( '\n' ),
    entryData, i, j, country, c,
    countryName, countryCode, countryCodeFound, paramVal;

  for ( i = 0, l = entries.length; i < l; i++ ) {

    entryData = entries[i].split( ',' );
    countryName = removeQuotes( entryData[ 0 ] );
    countryCodeFound = false;
    paramVal = parseFloat( removeQuotes( entryData[ 2 ] ) );

    for ( j = 0; j < countriesNames.length; j++ ) {
      if ( countriesNames[ j ][ 1 ] === countryName ) {
        countryCodeFound = true;
        countryCode = countriesNames[ j ][ 0 ];
        break;
      }
    }

    if ( !countryCodeFound ) {
      console.log( 'Missing country:', countryName );
    }

    if ( isNaN( paramVal ) ) {
      console.log( 'Missing value for', countryName );
    }

    if ( countryCodeFound && !isNaN( paramVal ) ) {

      if ( !finalData[ countryCode ] ) {
        finalData[ countryCode ] = {
          code: countryCode,
          name: countryName
        };
      }

      finalData[ countryCode ][ +entryData[ 1 ] ] = paramVal;

    }

  }

  for ( country in finalData ) {
    if ( Object.keys( finalData[ country ] ).length !== 9 ) {
      for ( c in meatCodes ) {
        if ( finalData[ country ][ c ] === undefined ) {
          finalData[ country ][ c ] = 0;
        }
      }
    }
  }

  saveParsedData();

}



// ---------- Save parsed data ----------

function saveParsedData() {

  var countryData = '',
    country, c, i,
    params = [];

  for ( country in finalData ) {

    if ( countryData === '' ) {
      countryData += 'id,';
      countryData += 'name,';
      for ( c in meatCodes ) {
        params.push( c );
        countryData += meatCodes[ c ].code + ',';
      }
      countryData = countryData.slice( 0, -1 );
    }

    countryData += '\n' + country;
    countryData += ',"' + finalData[ country ].name + '"';
    for ( i = 0; i < params.length; i++ ) {
      countryData += ',' + parseFloat( finalData[ country ][ params[ i ] ]).toFixed( 2 );
    }
  }

  fs.writeFile( destFile, countryData, function( err ) {
    if ( err ) throw err;
  });

}



// ---------- Utilities ----------

function removeQuotes( s ) {
  return String( s ).replace( /"/g, '' );
}



// ---------- Main function ----------

exports.parse = function( sourceFile, destinationFile ) {

  destFile = destinationFile;

  fs.readFile( sourceFile, 'utf-8', function( err, sourceFileData ){
    parseCSV( sourceFileData );
  });

};


