#!/usr/bin/env node

var	helper = require('./lib/helper.js'),
	cli = require('commander'),
	parser = require('xml-parser'),
	fs = require('fs.extra'),
	execSync = require('exec-sync'),
	path = require('path');

///////////////////////////////////////////////////////////////////////////////

var runtimeFailure = function(message) {
	helper.errorStream(message);
	process.exit(-1);
}

///////////////////////////////////////////////////////////////////////////////

cli.version('1.0.0')
	.usage('[options]')
	.option('-s, --src [src]', 'The source directory where your iPhoto Library is')
	.option('-d, --dest [dest]', 'The destination directory you want to export the event(s) to')
	.option('-l, --list [list]', 'List all events and indexes')
	.option('-i, --index [index]', 'Export a specific event by index')
	.parse(process.argv);

///////////////////////////////////////////////////////////////////////////////

// Check args
if (typeof cli.src == 'undefined') {
	runtimeFailure('Source directory must be set!');
}

if (typeof cli.dest == 'undefined') {
	runtimeFailure('Destination directory must be set!');
}

///////////////////////////////////////////////////////////////////////////////

// Name of the iPhoto data file
var albumFile = 'AlbumData.xml';
var exportDir = cli.dest + 'iPhotoExport/';

///////////////////////////////////////////////////////////////////////////////

// Find all master images and their key reference
var loadAllImages = function(albumDataObject) {
	var allImageObjects = albumDataObject.root.children[albumDataObject.root.children.length-1].children[albumDataObject.root.children[albumDataObject.root.children.length-1].children.length-1];
	var allImages = {};
	var currentId = 0;
	for (var i = 0; i < allImageObjects.children.length; i++) {	
		if (i % 2 == 0) {
			currentId = allImageObjects.children[i].content;
		} else {
			if (allImageObjects.children[i].children[11].content.indexOf('Masters') > -1) {
				allImages['id_' + currentId] = allImageObjects.children[i].children[11].content;
			} else {
				allImages['id_' + currentId] = allImageObjects.children[i].children[23].content;
			}
		}
	}

	return allImages;
}

// Display a single event
var displayEvent = function(userEvent, index) {
	var imageCount = userEvent.children[17].content;
	var eventName = userEvent.children[5].content;
	console.log('-------------------------------------------------------------------------------');
	console.log('Name: ' + eventName);
	console.log('Index: ' + index);
	console.log('Images: ' + imageCount);
	console.log('-------------------------------------------------------------------------------');
}

// Display event names and image counts
var displayAllEvents = function(userEvents) {
	for (var i = 3; i < userEvents.children.length; i++) {
		var userEvent = userEvents.children[i];
		displayEvent(userEvent, i);
	}
}

// Export a single image
var exportImage = function(imageId, allImages, destination) {
	var src = allImages['id_' + imageId];
	var dest = path.normalize(destination + '/' + path.basename(src));
	var result = execSync('cp -v "' + src + '" "' + dest + '"');
	helper.warningStream(result);
}

// Export a single event
var exportEvent = function(userEvent, allImages) {
	var eventName = userEvent.children[5].content;
	var eventImages = userEvent.children[15];
	var eventFolder = path.normalize(exportDir + eventName + '/');
	
	// Create folder for the event
	fs.mkdirp(eventFolder, function(err) {
		if (err) {
			helper.errorStream('Error creating folder: ' + eventFolder);
		} else {
			helper.successStream('Folder created: ' + eventFolder);

			// Export images
			var imageId = 0;
			for (var i = 0; i < eventImages.children.length; i++) {
				imageId = eventImages.children[i].content;
				exportImage(imageId, allImages, eventFolder);
			}

			helper.successStream('Event processed succesfully => ' + eventName);
		}
	});
}

var getEventByIndex = function(index, userEvents) {
	return userEvents.children[index];
}

var exportAllEvents = function(userEvents, allImages) {
	for (var i = 3; i < userEvents.children.length; i++) {
		var userEvent = userEvents.children[i];
		exportEvent(userEvent, allImages);
	}
}

///////////////////////////////////////////////////////////////////////////////

// Check for iPhoto data file
fs.exists(cli.src + albumFile, function(exists)
{
	if (!exists) {
		
		runtimeFailure('Unable to find the iPhoto album file at: ' + cli.src + albumFile);

	} else {

		// Read the XML
		var xml = fs.readFileSync(cli.src + albumFile, 'utf8');

		// Convert to JSON
		var albumDataObject = parser(xml);

		// Get events
		var allEvents = albumDataObject.root.children[0].children[11];

		// Get master-images
		var allImages = loadAllImages(albumDataObject);

		// If an index is specified
		if (cli.index) {
			
			var userEvent = getEventByIndex(cli.index, allEvents);
			exportEvent(userEvent, allImages);

		} else if (cli.list) {

			displayAllEvents(allEvents);

		} else {

			exportAllEvents(allEvents, allImages);

		}
	}
});
