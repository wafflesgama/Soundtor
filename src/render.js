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


 var categoryClasses = ["tag_genre", "tag_vibe", "tag_atmos", "tag_aria", "tag_pulse"];

 var selectedValues = [];

 // Managing UI
 var selectedTags = [];
 var connectionState = 0;
 var chart;


 ////////// Start
 SpawnTags(0);
 RefreshGenButton();
 BindSliders();
 AddBackButtonCallback();
 AddGenerateButtonCallback();
 SetStatsVisibility(false);
 InitializeChart();
 OpenPort("127.0.0.1", 9001);

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
     return GetCurrentCategoryIndex() < categoryTags.length;
 }

 function HasAnyTags() {
     return selectedTags.length > 0;
 }

 function GetCurrentTagList() {
     return categoryTags[GetCurrentCategoryIndex()];
 }

 function SpawnTags(categoryNumber) {
     ClearTags();
     let tagsContainer = $(".tagsContainer");

     let categoryContents = categoryTags[categoryNumber];
     let categoryTag = categoryClasses[categoryNumber];

     categoryContents.forEach((tagContent) => {
         let tag = $("<button>");
         tag.html(tagContent);
         tag.addClass("tag");
         tag.addClass("animate__bounceIn");
         tag.addClass(categoryTag);
         tagsContainer.append(tag);
     });
     console.log("GetCurrentCategoryIndex " + GetCurrentCategoryIndex() + " categoryTags " + categoryTags.length);
     if (GetCurrentCategoryIndex() + 2 < categoryTags.length || HasAnyTags()) {
         let skipTag = $("<button>");
         skipTag.html("Skip");
         skipTag.addClass("tag");
         skipTag.addClass("animate__bounceIn");
         skipTag.addClass("tag_def");
         tagsContainer.append(skipTag);
     }


     AddActiveTagsCallback();

 }

 function ClearTags() {
     $(".tagsContainer").html('');
 }


 function AddActiveTagsCallback() {
     $(".tag").click(function () {

         if (!HasMoreCategories()) return;

         var clickedButton = $(this);


         if (clickedButton.hasClass("tag_def")) {
             selectedValues.push(0);
         } else {

             if (selectedTags === null || selectedTags.length === 0)
                 $(".inputResult").html('');

             $(".inputResult").append(clickedButton);
             selectedTags.push(clickedButton);

             console.log("selectedValues.push catergoryvalues " + categoryValues + " in position: " + GetCurrentCategoryIndex() + " and " + GetCurrentTagList().indexOf(clickedButton.text()) + "since currentaglist is " + GetCurrentTagList() + " and clicked.html is " + clickedButton.text());

             let value = GetCurrentTagList().indexOf(clickedButton.text());
             selectedValues.push(categoryValues[GetCurrentCategoryIndex()][GetCurrentTagList().indexOf(clickedButton.text())]);
             console.log("SelectedValues " + selectedValues);
         }
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
         if (selectedTags === null || selectedValues.length === 0) return;


         if (selectedTags.length != 0) {
             selectedTags[selectedTags.length - 1].remove();
             selectedTags.pop();
         }
         selectedValues.pop();

         if (selectedTags.length === 0)
             $(".inputResult").html('Add one or more tags');

         SpawnTags(GetCurrentCategoryIndex());
         RefreshGenButton();
         SetStatsVisibility(false);
     });

 }

 function RefreshGenButton() {
     $(".generateButton").prop('disabled', HasMoreCategories());
 }

 function SetStatsVisibility(visible) {
     let hasClass = $(".stats").hasClass("hidden");
     console.log("SetStatsVisibility, hasClass " + hasClass + " toVisible " + visible);
     if (visible && hasClass)
         $(".stats").removeClass("hidden");
     else if (!visible && !hasClass)
         $(".stats").addClass("hidden");
 }

 function RefreshChart() {
     chart.options.data.data = [selectedValues];
     console.log(chart.options.data.data);
     chart.reload();
 }

 function RefreshSliders() {
     for (let index = 0; index < selectedValues.length; index++)
         $(".slider" + (index + 1)).val(selectedValues[index] * 100);

 }

 function AddGenerateButtonCallback() {
     $(".generateButton").click(function () {
         RefreshChart();
         RefreshSliders();
         SetStatsVisibility(true);
         SendSelectedValues();
     });

 }

 function BindSliders() {
     $(".slider").on("input", function () {
         //  alert("Changed");
         let slider = $(this);
         console.log("Submitted slider val " + slider.val());
         let index;
         if (slider.hasClass("slider1"))
             index = 0;
         else if (slider.hasClass("slider2"))
             index = 1;
         else if (slider.hasClass("slider3"))
             index = 2;
         else if (slider.hasClass("slider4"))
             index = 3;
         else if (slider.hasClass("slider5"))
             index = 4;

         selectedValues[index] = slider.val() / 100.0;
         RefreshChart();
         console.log(chart);
     });
 }

 function InitializeChart() {
     let element = document.getElementById('chart-container');
     chart = new window.PolygonChart({
         target: element,
         radius: 170,
         data: {
             data: [selectedValues],
             sides: 5,
             tooltips: {
                 roundTo: 2,
                 percentage: true,
             },
             colors: {
                 normal: {
                     polygonStroke: "white",
                     polygonFill: "#ffffffdb",
                     pointStroke: "#gray",
                     pointFill: "#fff",
                 },
                 onHover: {
                     polygonStroke: "white",
                     polygonFill: "#ffffffdb",
                     pointStroke: "white",
                     pointFill: "gray",
                 },
             },
         },
         polygon: {
             colors: {
                 normal: {
                     fill: "transparent",
                     stroke: "#ffffffa3",
                 },

                 onHover: {
                     fill: "#ffffffa3",
                     stroke: "white",
                 }
             }
         },
         levels: {
             count: 4,
             labels: {
                 enabled: false,
                 position: {
                     spline: 1,
                     quadrant: 0,
                 },
                 colors: {
                     normal: "transparent",
                     onHover: "gray",
                 }
             },
             anime: {
                 duration: 7500,
                 easing: 'linear',
             }
         },
     });
     chart.options.animation.autoplay = true;
     chart.init();
 }


 ///////////////  UPD OSC Connection
 function OpenPort(address, portnum) {
     udpPort = new osc.UDPPort({
         // This is the port we're listening on.
         localAddress: address,
         localPort: portnum,

         // This is where sclang is listening for OSC messages.
         remoteAddress: address,
         remotePort: portnum,
         metadata: true
     });

     udpPort.on("ready", PortReady);
     udpPort.on("error", PortError);
     udpPort.on("message", PortMessageReceived);
     udpPort.open();

 }


 function PortError(error) {
     console.log("Port error occurred: ", error.message);
     connectionState = -1;
 }

 function PortMessageReceived(message, timeTag, info) {
     console.log("Port msg received : ", message);
 }

 function PortReady() {
     connectionState = 1;
     console.log("Port ready");
 }

 function ClosePort() {
     udpPort.close();
 }

 function SendSelectedValues() {

     args = [];
     selectedValues.forEach((value) => {
         args.push({
             type: "f",
             value: value
         });
     });

     var msg = {
         address: "/wek/inputs",
         args: args
     };
     SendData(msg);
 }

 function SendData(data) {
     udpPort.send(data);
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