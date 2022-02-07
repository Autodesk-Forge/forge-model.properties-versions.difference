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


const global_AddedView = new AddedView()
const global_RemovedView = new RemovedView()
const global_ChangedView = new ChangedView()

$(document).ready(function () {

  //show all added elements in right view
  $('#alladded').on('change.bootstrapSwitch', function (e) {
    showDiff()
  })
  //show all removed elements in left view 
  $('#allremoved').on('change.bootstrapSwitch', function (e) {
    showDiff()
  })
  //show all changed elements in both views 
  $('#allchanged').on('change.bootstrapSwitch', function (e) {
    showDiff()
  })

  //place the diff icon in the middle of both views
  $('#compare').css({
    position: "absolute",
    marginLeft: 0, marginTop: 0,
    top: $('#forgeViewer_left').position().top + $('#col_viewer').height() / 4.0,
    left: $('#forgeViewer_left').position().left + $('#col_viewer').width() / 2.0 - 40
  })

  //initialize headers of table views
  global_AddedView.initViewHeader()
  global_RemovedView.initViewHeader()
  global_ChangedView.initViewHeader()

  $('#compare').click(e => {

    //start to run
    $('#compare_img')[0].src = './img/spinning-wheel-gif-7.gif'
    $('#addedTitle').html(`Added Items`)
    $('#removedTitle').html(`Removed Items`)
    $('#changedTitle').html(`Changed Items`)
    global_AddedView.produceView([])
    global_RemovedView.produceView([])
    global_ChangedView.produceView([])

    $.ajax({
      url: '/api/forge/index/' + project_id + '/true',
      type: 'POST',
      dataType: 'json',
      data: {
        diffs: [
          {
            prevVersionUrn: model_version_left,
            curVersionUrn: model_version_right
          }
        ]
      },
      success: function (data) {
      },
      error: function (error) {
      }
    });

  }) 
});


//show diff in a few filters
function showDiff() { 

  //reset all emlements with default appearance 
  forgeViewer_left.showAll()
  forgeViewer_right.showAll() 
  forgeViewer_left.clearThemingColors(forgeViewer_left.model);
  forgeViewer_right.clearThemingColors(forgeViewer_right.model);

  //if [all added] is ticked, show all added elements in right view
  if ($('#alladded')[0].checked) {
    global_AddedView._items.forEach(i => {
      forgeViewer_right.setThemingColor(i.otgId, new THREE.Vector4(0, 1, 0, 1))
    })
  }
  //if [all removed] is ticked, show all removed elements in left view 
  if ($('#allremoved')[0].checked) {
    global_RemovedView._items.forEach(i => {
      forgeViewer_left.setThemingColor(i.otgId, new THREE.Vector4(1, 0, 0, 1))
    })
  }
  //if [all changed] is ticked, show all changed elements in both views 
  if ($('#allchanged')[0].checked) { 
    global_ChangedView._items.forEach(i => {
      forgeViewer_left.setThemingColor(i.otgId, new THREE.Vector4(0, 0, 1, 1))
      forgeViewer_right.setThemingColor(i.otgId, new THREE.Vector4(0, 0, 1, 1))
    })
  }

}

function showUser() {
  jQuery.ajax({
    url: '/api/forge/user/profile',
    success: function (profile) {
      var img = '<img src="' + profile.picture + '" height="30px">';
      $('#userInfo').html(img + profile.name);
    }
  });
}