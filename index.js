var express 	=   require( 'express' )  
	, http 			=		require( 'http' )
	, async 		=		require( 'async' )
	, multer  	= 	require( 'multer' )
	, upload 		=		multer( { dest: 'uploads/' } )	
	, exphbs  	= 	require( 'express-handlebars' )
	, easyimg 	=		require( 'easyimage' )	
	, _ 				=		require( 'lodash' )
	, cv 				= 	require( 'opencv' );

var exts = {
	'image/jpeg' 	: 	'.jpg',
	'image/png'		: 	'.png',
	'image/gif'		: 	'.gif'
}


var port = 8080;


var app = express();


app.use(express.static(__dirname + '/public'))


app.engine('.hbs', exphbs( { extname: '.hbs', defaultLayout: 'default' } ) );
app.set( 'view engine', '.hbs' );


app.get('/', function( req, res, next ) {

	return res.render('index');

});


app.post('/upload', upload.single('file'), function(req, res, next){
	
	
	var filename = req.file.filename + exts[req.file.mimetype]
		, src = __dirname + '/' + req.file.path
		, dst = __dirname + '/public/images/' + filename;

	async.waterfall(
		[
			function( callback ) {
				
				if (!_.contains(
					[
						'image/jpeg',
						'image/png',
						'image/gif'
					],
					req.file.mimetype
				) ) {
					
					return callback( new Error( 'Invalid file - please upload an image (.jpg, .png, .gif).' ) )

				}

				return callback();

			},
			function( callback ) {

				easyimg.info( src ).then(
		
					function(file) {     
					
						if ( ( file.width < 960 ) || ( file.height < 300 ) ) {            
							
							return callback( new Error( 'Image must be at least 640 x 300 pixels' ) );

						}

						return callback();
					}
				);
			},
			function( callback ) {
				
				
				easyimg.resize(
          {
            width      :   960,            
            src        :   src, 
            dst        :   dst            
          }              
        ).then(function(image) {
        	
        	return callback();

        });

			},
			function( callback ) {

				
				cv.readImage( dst, callback );

			},
			function( im, callback ) {

				
				im.detectObject( cv.FACE_CASCADE, {}, callback );

			}

		],
		function( err, faces ) {
			
			
			if ( err ) {
				
				return res.render(
					'error',
					{
						message : err.message
					}
				);
			}

			/**
			 * We're all good; render the result page.
			 */
			return res.render(
	    	'result',
	    	{
	    		filename 	: 	filename,
	    		faces 		: 	faces
	    	}
	    );

		}			
	);

});

/**
 * Start the server 
 */
http.createServer(  
	app
).listen( port, function( server ) {
	console.log( 'Listening on port %d', port );
});
