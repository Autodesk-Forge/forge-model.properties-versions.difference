/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

var forgeViewer_left;
var forgeViewer_right;

//options for SVF2
var options = {
  env: 'AutodeskProduction2',
  getAccessToken: getForgeToken,
  api: 'streamingV2'
};

Autodesk.Viewing.Initializer(options, () => {
  forgeViewer_left = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer_left'));
  forgeViewer_left.start();
  forgeViewer_right = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer_right'));
  forgeViewer_right.start();
  //adjust the size to make suitable view
  $('.adsk-viewing-viewer').css({ "height": '50%' })
  $('.adsk-viewing-viewer').css({ "width": $('#col_viewer').width() / 2.0 })
});


// @urn the model to show
// @viewablesId which viewables to show, 
function loadModel(viewer, urn, viewableId) {

  var documentId = 'urn:' + urn;
  Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);

  function onDocumentLoadSuccess(doc) {
    // if a viewableId was specified, load that view, otherwise the default view
    var viewables = (viewableId ? doc.getRoot().findByGuid(viewableId) : doc.getRoot().getDefaultGeometry());
    viewer.loadDocumentNode(doc, viewables).then(i => {
      // any additional action...
    });
  }

  function onDocumentLoadFailure(viewerErrorCode) {
    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
  }
}

function getForgeToken(callback) {
  fetch('/api/forge/oauth/token').then(res => {
    res.json().then(data => {
      callback(data.access_token, data.expires_in);
    });
  });
}


function getBoundingBoxByViewerAPI(viewer, svf2Id) {

  var fragIds = []
  viewer.model.getInstanceTree().enumNodeFragments(svf2Id, i => fragIds.push(i))
  //fragments list array
  var fragList = viewer.model.getFragmentList();
  const fragbBox = new THREE.Box3()
  const nodebBox = new THREE.Box3()

  fragIds.forEach(function (fragId) {
    fragList.getWorldBounds(fragId, fragbBox)
    nodebBox.union(fragbBox)
  })
  return nodebBox
}