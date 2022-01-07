"use strict";

// UDP-OSC Connection
var osc = require("osc");

var udpPort;
var cat1Tags = ["Dreamy", "Classical", "Jazzy", "Funky", "Grim", "Dark"];
var cat2Tags = ["Drone", "Howling", "Mellow", "Muffled"];
var cat3Tags = ["Squeal", "Melodical"];
var cat4Tags = ["Pad", "Percussive", "Monotonous", "Grindy"];
var cat5Tags = ["Noisy", "Soft", "Pure", "Rich"];
var selectedIndexes = []; // Managing UI

var selectedTags = []; // Animations

$(".a_button").click(function () {
  var button = $(this);
  if (button.hasClass("animate__bounceIn")) button.removeClass("animate__bounceIn");
  setTimeout(function () {
    button.addClass("animate__bounceIn");
  }, 1);
}); // document.getElementById("").addEventListener("click", () => {
// });

$(".tag").click(function () {
  // alert('Clicked tag');
  if (selectedTags === null || selectedTags.length === 0) {
    $(".inputResult").html('');
  }

  $(".inputResult").append($(this));
  selectedTags.push($(this));
});
$(".backButton").click(function () {
  if (selectedTags === null || selectedTags.length === 0) return;
  $(".tagsContainer").append(selectedTags[selectedTags.length - 1]);
  selectedTags.pop();
  if (selectedTags.length === 0) $(".inputResult").html('Add one or more tags');
});
$(".generateButton").click(function () {});
SpawnTags(0);

function SpawnTags(categoryNumber) {
  var tagsContainer = $(".tagsContainer");
  tagsContainer.html('');
  var categoryContents;
  var categoryTag;

  switch (categoryNumber) {
    case 0:
      categoryContents = cat1Tags;
      categoryTag = "cat1";
      break;

    case 1:
      categoryContents = cat2Tags;
      categoryTag = "cat2";
      break;

    case 2:
      categoryContents = cat3Tags;
      categoryTag = "cat3";
      break;

    case 3:
      categoryContents = cat4Tags;
      categoryTag = "cat4";
      break;

    default:
      categoryContents = cat5Tags;
      categoryTag = "cat5";
      break;
  }

  categoryContents.forEach(function (tagContent) {
    //  let tag = document.createElement("button");
    var tag = $("button");
    tag.html(tagContent);
    tag.addClass("tag"); //  tag.classList.add("tag");
    //  tag.classList.add(categoryTag);
    //  tag.innerHTML(tagContent);

    tagsContainer.append(tag);
  });
} // $(".tag").each(item => {
//     item.addEventListener("click", () => {
//         alert("clicked");
//         item.innerHTML('clicked');
//     });
// });
//  document.getElementById("testButton").addEventListener("click", () => {
//     if (numclick === 0) {
//         udpPort = new osc.UDPPort({
//             // This is the port we're listening on.
//             localAddress: "127.0.0.1",
//             localPort: 57120,
//             // This is where sclang is listening for OSC messages.
//             remoteAddress: "127.0.0.1",
//             remotePort: 9001,
//             metadata: true
//         }); 
//         console.log("new UDPPORT "+ udpPort);
//         // Open the socket.
//         udpPort.open();
//         console.log("open UDPPORT");
//     } else {
//         var msg = {
//             address: "/teste1",
//             args: [
//                 {
//                     type: "f",
//                     value: Math.random()
//                 },
//                 {
//                     type: "f",
//                     value: Math.random()
//                 }
//             ]
//         };
//         console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
//         udpPort.send(msg);
//         console.log("sent");
//     }
//     numclick++;
//     });