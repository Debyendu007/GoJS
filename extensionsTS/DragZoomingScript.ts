"use strict";
/*
*  Copyright (C) 1998-2019 by Northwoods Software Corporation. All Rights Reserved.
*/

import * as go from "../release/go";
import { DragZoomingTool } from "./DragZoomingTool";

var myDiagram: go.Diagram;
var myLoading: go.Node;

export function init() {
	if (typeof (<any>window)["goSamples"] === 'function') (<any>window)["goSamples"]();  // init for these samples -- you don't need to call this  

	const $ = go.GraphObject.make;  // for conciseness in defining templates

	myDiagram =
		$(go.Diagram, "myDiagramDiv",
			{
				initialDocumentSpot: go.Spot.Center,
				initialViewportSpot: go.Spot.Center,

				// Define the template for Nodes, just some text inside a colored rectangle
				nodeTemplate:
				$(go.Node, "Spot",
					{ width: 70, height: 20 },
					$(go.Shape, "Rectangle",
						new go.Binding("fill", "c")),
					$(go.TextBlock,
						{ margin: 2 },
						new go.Binding("text", "c"))),

				// Define the template for Links, just a simple line
				linkTemplate:
				$(go.Link,
					$(go.Shape, { stroke: "black" })),

				layout:
				$(go.TreeLayout,
					{
						angle: 90,
						nodeSpacing: 4,
						compaction: go.TreeLayout.CompactionNone
					}),

				model:
				$(go.TreeModel,
					{ // we use single character property names, to save space if rendered as JSON
						nodeKeyProperty: "k",
						nodeParentKeyProperty: "p"
					})
			});

	// Add an instance of the custom tool defined in DragZoomingTool.js.
	// This needs to be inserted before the standard DragSelectingTool,
	// which is normally the third Tool in the ToolManager.mouseMoveTools list.
	myDiagram.toolManager.mouseMoveTools.insertAt(2, new DragZoomingTool());

	// This is a status message
	myLoading =
		$(go.Part,
			{ selectable: false, location: new go.Point(0, 0) },
			$(go.TextBlock, "loading...",
				{ stroke: "red", font: "20pt sans-serif" }));

	// temporarily add the status indicator
	myDiagram.add(myLoading);

	// allow the myLoading indicator to be shown now,
	// but allow objects added in loadTree to also be considered part of the initial Diagram
	myDiagram.delayInitialization(loadTree);
}

function loadTree() {
	// create some tree data
	var total = 99;
	var treedata = [];
	for (var i = 0; i < total; i++) {
		// these property names are also specified when creating the TreeModel
		var d = {
			k: i,  // this node data's key
			c: go.Brush.randomColor(),  // the node's color
			p: (i > 0 ? Math.floor(Math.random() * i / 2) : undefined)  // the random parent's key
		};
		treedata.push(d);
	}

	// give the Diagram's model all the data
	myDiagram.model.nodeDataArray = treedata;

	// remove the status indicator
	myDiagram.remove(myLoading);
}