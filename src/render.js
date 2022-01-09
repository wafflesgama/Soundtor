 // UDP-OSC Connection
 var osc = require("osc");
 var udpPort;

 var categoryTags = [
     ["Squeal", "Muffled","Dark","Rich"],
     ["Melodical", "Pad", "Percussive"],
     ["Dreamy", "Mellow", "Dry"],
     ["Classical", "Funky", "Grim", "Noisy","Pure"],
     ["Soft", "Bang", "Grinding"]
 ];

 var categoryValues = [
     [0.98, 0.2, 0.43, 0.68],
     [0.54, 0.78, 0.15],
     [0.65, 0.35,0.04],
     [0.35, 0.67, 0.78, 1,0.01],
     [0.26, 0.9, 0.78]
 ];


 var categoryClasses = ["tag_genre", "tag_vibe", "tag_atmos", "tag_aria", "tag_pulse"];

 var generatedValues = [];
 var finalValues = [];

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
     return generatedValues.length;
 }

 function HasMoreCategories() {
     return GetCurrentCategoryIndex() < categoryTags.length;
 }

 function HasAnyTags() {
     //  console.log("generatedValues "+ generatedValues.length);
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
     console.log("HasAnyTags " + HasAnyTags() + " GetCurrentCategoryIndex " + GetCurrentCategoryIndex() + " categoryTags " + categoryTags.length);
     if (GetCurrentCategoryIndex() + 1 < categoryTags.length || HasAnyTags()) {
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
             generatedValues.push(0);
         } else {

             if (selectedTags === null || selectedTags.length === 0)
                 $(".inputResult").html('');

             $(".inputResult").append(clickedButton);
             selectedTags.push(clickedButton);

             let value = GetCurrentTagList().indexOf(clickedButton.text());
             generatedValues.push(categoryValues[GetCurrentCategoryIndex()][GetCurrentTagList().indexOf(clickedButton.text())]);
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
         if (selectedTags === null || generatedValues.length === 0) return;


         if (selectedTags.length != 0) {
             selectedTags[selectedTags.length - 1].remove();
             selectedTags.pop();
         }
         generatedValues.pop();

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
     chart.options.data.data = [finalValues];
     console.log(chart.options.data.data);
     chart.reload();
 }


 function RefreshSliders() {
     for (let index = 0; index < finalValues.length; index++)
         $(".slider" + (index + 1)).val(finalValues[index] * 100);

 }

 function AddGenerateButtonCallback() {
     $(".generateButton").click(function () {
         console.log("finalValues" + finalValues);
         console.log("generatedValues" + generatedValues);
         finalValues = generatedValues.map((x) => x);;
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

         finalValues[index] = slider.val() / 100.0;
         console.log("finalValues" + finalValues);
         console.log("generatedValues" + generatedValues);
         RefreshChart();
         SendSelectedValues();
     });
 }

 function InitializeChart() {
     let element = document.getElementById('chart-container');
     chart = new window.PolygonChart({
         target: element,
         radius: 170,
         data: {
             data: [finalValues],
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
     chart.init();
 }


 ///////////////  UPD OSC Connection
 function OpenPort(address, portnum) {
     udpPort = new osc.UDPPort({
         // This is the port we're listening on.
         localAddress: address,
         localPort: "7001",

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

     if (message.address.startsWith("/oscFader"))
         ChangeManuallySliders(message);


 }

 function ChangeManuallySliders(message) {
     switch (message.address) {
         case '/oscFader1':
             finalValues[0] = message.args[0].value;
             break;
         case '/oscFader2':
             finalValues[1] = message.args[0].value;
             break;
         case '/oscFader3':
             finalValues[2] = message.args[0].value;
             break;
         case '/oscFader4':
             finalValues[3] = message.args[0].value;
             break;
         default:
             finalValues[4] = message.args[0].value;
             break;
     }

     RefreshSliders();
     RefreshChart();
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
     finalValues.forEach((value) => {
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
