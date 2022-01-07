 // UDP-OSC Connection
 var osc = require("osc");
 var udpPort;

 var categoryTags = [
     ["Dreamy", "Classical", "Jazzy", "Funky", "Grim", "Dark"],
     ["Drone", "Howling", "Mellow", "Muffled"],
     ["Squeal", "Melodical"],
     ["Pad", "Percussive", "Monotonous", "Grindy"],
     ["Noisy", "Soft", "Pure", "Rich"]
 ];

 var categoryValues = [
     [0.1, 0.2, 0.3, 0.4, 0.5, 0.6],
     [0.1, 0.2, 0.3, 0.4],
     [0.1, 0.2],
     [0.1, 0.2, 0.3, 0.4],
     [0.1, 0.2, 0.3, 0.4, 0.5, 0.6],
     [0.1, 0.2, 0.3, 0.4]
 ];


 var categoryClasses = ["tag_genre", "tag_vibe", "tag_atmos", "tag_pulse", ];

 var selectedValues = [];

 // Managing UI
 var selectedTags = [];



 ////////// Start
 AddBackButtonCallback();
 SpawnTags(GetCurrentCategoryIndex());
 RefreshGenButton();


 // Animations
 $(".a_button").click(function () {
     let button = $(this);
     if (button.hasClass("animate__bounceIn"))
         button.removeClass("animate__bounceIn");

     setTimeout(function () {
         button.addClass("animate__bounceIn");
     }, 1);
 });



 function GetCurrentCategoryIndex() {
     return selectedValues.length;
 }

 function HasMoreCategories() {
     return GetCurrentCategoryIndex() < categoryTags.length - 1;
 }

 function GetCurrentTagList() {
     return categoryTags[GetCurrentCategoryIndex()];
 }

 function SpawnTags(categoryNumber) {
     ClearTags();
     let tagsContainer = $(".tagsContainer");

     let categoryContents = categoryTags[categoryNumber + 1];
     let categoryTag = categoryClasses[categoryNumber + 1];

     categoryContents.forEach((tagContent) => {
         let tag = $("<button>");
         tag.html(tagContent);
         tag.addClass("tag");
         tag.addClass("animate__bounceIn");
         tag.addClass(categoryTag);
         tagsContainer.append(tag);
     });
     AddActiveTagsCallback();
 }

 function ClearTags() {
     $(".tagsContainer").html('');
 }


 function AddActiveTagsCallback() {
     $(".tag").click(function () {

         if (!HasMoreCategories()) return;

         var clickedButton = $(this);

         if (selectedTags === null || selectedTags.length === 0)
             $(".inputResult").html('');


         $(".inputResult").append(clickedButton);
         selectedTags.push(clickedButton);

         selectedValues.push(categoryValues[GetCurrentCategoryIndex()][GetCurrentTagList().indexOf(clickedButton.html)]);

         if (HasMoreCategories())
             SpawnTags(GetCurrentCategoryIndex());
         else {
             ClearTags();
         }

         RefreshGenButton();

         //      alert("no more");
     });
 }


 function AddBackButtonCallback() {
     $(".backButton").click(function () {
         if (selectedTags === null || selectedTags.length === 0) return;

         selectedTags[selectedTags.length - 1].remove();
         selectedTags.pop();
         selectedValues.pop();

         if (selectedTags.length === 0)
             $(".inputResult").html('Add one or more tags');

         SpawnTags(GetCurrentCategoryIndex());
         RefreshGenButton();
     });

 }

 function RefreshGenButton() {
     $(".generateButton").prop('disabled', HasMoreCategories());
 }


 function AddGenerateButtonCallback() {
     $(".generateButton").click(function () {

     });

 }

 //  document.getElementById("testButton").addEventListener("click", () => {
 //      if (numclick === 0) {

 //          udpPort = new osc.UDPPort({
 //              // This is the port we're listening on.
 //              localAddress: "127.0.0.1",
 //              localPort: 57120,

 //              // This is where sclang is listening for OSC messages.
 //              remoteAddress: "127.0.0.1",
 //              remotePort: 9001,
 //              metadata: true
 //          });

 //          console.log("new UDPPORT " + udpPort);

 //          // Open the socket.
 //          udpPort.open();
 //          console.log("open UDPPORT");
 //      } else {
 //          var msg = {
 //              address: "/wek/inputs",
 //              args: [{
 //                      type: "f",
 //                      value: Math.random()
 //                  },
 //                  {
 //                      type: "f",
 //                      value: Math.random()
 //                  }
 //              ]
 //          };
 //          console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
 //          udpPort.send(msg);
 //          console.log("sent");
 //      }
 //      numclick++;
 //  });