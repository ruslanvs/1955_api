var express = require( "express" );
var app = express();

var bodyParser = require( "body-parser" );
var path = require( "path" );
var mongoose = require( "mongoose" );

mongoose.Promise = global.Promise;

app.use( bodyParser.json() );
app.use( express.static( path.join( __dirname, "./static") ) );

app.set( "views", path.join( __dirname, "./views" ) );
app.set( "view engine", "ejs" );

mongoose.connect( "mongodb://localhost/1945_api" );

var PersonSchema = new mongoose.Schema( {
    name: {type: String, required: true},
}, {timestamps: true} );
var Person = mongoose.model( "Person", PersonSchema );

app.get( "/", function( req, res ){
    Person.find( {}, function( err, people ){
        if( err ){
            console.log( err );
            res.send( err );
        } else {
            res.send( people );
        }
    })
});

app.get( "/people/:name", function( req, res ){
    Person.find( {name: req.params.name}, function( err, person ){
        if( err ){
            res.send( err );
        } else {
            res.send( person );
        }
    })
});

app.get( "/new/:name/", function( req, res ){
    var person = new Person( {
        name: req.params.name,
    })
    person.save( function( err ){
        if( err ){
            res.send( err );
        } else {
            res.redirect( "/" );
        }
    })
});

app.get( "/remove/:name/", function( req, res ){
    Person.remove( {name: req.params.name}, function( err ){
        if( err ){
            res.send( err );
        } else {
            res.redirect( "/" );
        }
    })
});

app.listen( 8000, function(){
    console.log( "listening on port 8000" );
});