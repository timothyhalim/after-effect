// Project Variables
var defaultOutput = "/FXOutput";

// Render Queue
if(app.project.file !== null){
	// Collect file data
    var fullpath = app.project.file.fsName;
	// ex. fullpath = "J:\KB\Episodes\Scenes\111\1710\KB_111_1710_FX_V01.aep"
	var shotdata = fullpath.split("\\").pop().split('_').slice(0, 3).join('_');
	// ex. shotdata = "KB_111_1710"
	var episode = shotdata.split("_")[1];
	// ex. episode = "111"
	
	// Get active comp
	var comp = app.project.activeItem;
	
	// Clear existing render queue
	var renderQueues = app.project.renderQueue.numItems;
	if (renderQueues > 0) {
		if (confirm("Do you want to clear Render Queue before rendering?")) {
			app.beginUndoGroup("Delete Render Queues");
			for (i = 1; i < renderQueues+1; i++) {
			    app.project.renderQueue.item(1).remove();
			} 
			app.endUndoGroup();
		}
	}
	
	// add comp to render queue
	var item = app.project.renderQueue.items.add(comp);

	// get render queue first output module
	var outputModule = item.outputModule(1);

	// set fx name
	var fxname = prompt("FX name", "");
	if (fxname != null) {
		// create render output folder
		var outputFolder = Folder([defaultOutput, episode, shotdata, fxname].join("/"));
		if (!outputFolder.exists) {
			outputFolder.create();
		}
		
		// set render output settings
		outputModule.applyTemplate("EXR");
		outputModule.file = File(outputFolder.toString() + "/"+shotdata+"_FX_"+fxname+"_[####]");
		
		// purge and start rendering
		app.beginSuppressDialogs();
		app.purge(PurgeTarget.ALL_CACHES);
		app.project.renderQueue.render();
		item.remove()
		app.purge(PurgeTarget.ALL_CACHES);
		app.endSuppressDialogs(false);
	} else {
		alert("Canceled!");
	}
	
}