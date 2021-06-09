{
    var defaultCompName = "";
    var defaultFrameRate = 25;
    var defaultWidth = 1920;
    var defaultHeight = 1080;
    var defaultStartFrame = 1;
    var defaultDuration = 1;
    
    var sourceFootage = undefined;

    function compFromFootage(thisObj){
        function buildUI(thisObj){
            var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Create Comp from Selection", undefined, {resizeable:true});
            res = "group{orientation:'column', alignment:['fill','fill'], alignChildren:['fill','fill'],\
                refreshButton:Button{text:'Refresh'}\
                panel : Panel {\
                    text:'Composition',\
                    orientation:'column',\
                    alignment:['fill','fill'],\
                    alignChildren:['fill','fill']\
                    nameGroup: Group {\
                        orientation:'row',\
                        alignment:['fill','fill'],\
                        alignChildren:['fill','center']\
                        nameLabel:StaticText{text:'Name', preferredSize:[60,20]}\
                        nameText:EditText{preferredSize:[150,20]}\
                    },\
                    widthGroup: Group {\
                        orientation:'row',\
                        alignment:['fill','fill'],\
                        alignChildren:['fill','fill']\
                        widthLabel:StaticText{text:'Width', preferredSize:[60,20]}\
                        widthText:EditText{preferredSize:[150,20]}\
                    },\
                    heightGroup: Group {\
                        orientation:'row',\
                        alignment:['fill','fill'],\
                        alignChildren:['fill','fill']\
                        heightLabel:StaticText{text:'Height', preferredSize:[60,20]}\
                        heightText:EditText{preferredSize:[150,20]}\
                    },\
                    fpsGroup: Group {\
                        orientation:'row',\
                        alignment:['fill','fill'],\
                        alignChildren:['fill','fill']\
                        fpsLabel:StaticText{text:'FPS', preferredSize:[60,20]}\
                        fpsText:EditText{preferredSize:[150,20]}\
                    },\
                    startGroup: Group {\
                        orientation:'row',\
                        alignment:['fill','fill'],\
                        alignChildren:['fill','fill']\
                        startLabel:StaticText{text:'Start', preferredSize:[60,20]}\
                        startText:EditText{preferredSize:[150,20]}\
                    },\
                    durationGroup: Group {\
                        orientation:'row',\
                        alignment:['fill','fill'],\
                        alignChildren:['fill','fill']\
                        durationLabel:StaticText{text:'Duration', preferredSize:[60,20]}\
                        durationText:EditText{preferredSize:[150,20]}\
                    },\
                },\
                applyButton:Button{text:'Apply'}\
            }";
            myPanel.grp = myPanel.add(res);
            
            // Defaults
            myPanel.grp.panel.nameGroup.nameText.text = defaultCompName;
            myPanel.grp.panel.widthGroup.widthText.text = defaultWidth;
            myPanel.grp.panel.heightGroup.heightText.text = defaultHeight;
            myPanel.grp.panel.fpsGroup.fpsText.text = defaultFrameRate;
            myPanel.grp.panel.startGroup.startText.text = defaultStartFrame;
            myPanel.grp.panel.durationGroup.durationText.text = defaultDuration;

            // Panel Sizing
            myPanel.layout.layout(true);
            myPanel.grp.minimumSize = myPanel.grp.size;
            myPanel.layout.resize();
            myPanel.onResizing = myPanel.onResize = function() {this.layout.resize()};

            // Signal
            myPanel.grp.refreshButton.onClick = function() {
                var compName = defaultCompName;
                var frameRate = defaultFrameRate;
                var width = defaultWidth;
                var height = defaultHeight;
                var startFrame = defaultStartFrame;
                var duration = defaultDuration;
                
                var selection = app.project.selection[0];
                if (selection instanceof FootageItem) {
                    sourceFootage = selection;
                    compName = sourceFootage.name.substring(0, sourceFootage.name.lastIndexOf("."));
                    frameRate = sourceFootage.frameRate;
                    duration = sourceFootage.duration;
                }
                
                myPanel.grp.panel.nameGroup.nameText.text = compName;
                myPanel.grp.panel.widthGroup.widthText.text = width;
                myPanel.grp.panel.heightGroup.heightText.text = height;
                myPanel.grp.panel.fpsGroup.fpsText.text = frameRate;
                myPanel.grp.panel.startGroup.startText.text = startFrame;
                myPanel.grp.panel.durationGroup.durationText.text = duration*frameRate;
            }
        
            myPanel.grp.applyButton.onClick = function() {
                n = myPanel.grp.panel.nameGroup.nameText.text
                w = parseInt(myPanel.grp.panel.widthGroup.widthText.text)
                h = parseInt(myPanel.grp.panel.heightGroup.heightText.text)
                d = parseFloat(myPanel.grp.panel.durationGroup.durationText.text)
                fps = parseFloat(myPanel.grp.panel.fpsGroup.fpsText.text)
                s = parseFloat(myPanel.grp.panel.startGroup.startText.text)
                
                var newComp = app.project.items.addComp(n, w, h,1, d/fps, fps);
                newComp.displayStartTime = (s+0.001)/fps
                var selections = app.project.selection
                for (var i = 0; i < selections.length; i++) {
                    newComp.layers.add(selections[i]);
                }
                newComp.openInViewer()
            }
        
            return myPanel;
        }
    
        var panel = buildUI (thisObj);
        
        if ((panel != null) && (panel instanceof Window)){
                panel.center();
                panel.show();
        }
    }
    compFromFootage(this);
}