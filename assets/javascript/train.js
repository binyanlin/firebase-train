$(document).ready(function () {

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBFiXOie3DAeASxfW-OHhASr8XuLrMWRvs",
    authDomain: "trains-88a9f.firebaseapp.com",
    databaseURL: "https://trains-88a9f.firebaseio.com",
    projectId: "trains-88a9f",
    storageBucket: "trains-88a9f.appspot.com",
    messagingSenderId: "1085898640284",
    appId: "1:1085898640284:web:3fc77fd6f69625fc"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();
  let trainNum;
  let minutesLeft;
  let nextTrainMins;
  let nextTrainArrival;
  let currentTime;

  //============================================================================

  $(document).on("click", ".close", function () {
    let trainId = $(this).parent().parent("tr").attr("id");
    // console.log(trainId);
    database.ref().once("value", function (snapshot) {
      let data = snapshot.val();

      for (let key in data) {
        if (Object.values(data[key]).indexOf(trainId) > -1) {
          database.ref(`${key}`).remove();
        };
      };
    });
  });

  database.ref().on("value", function (snapshot) {

    if (snapshot.exists()) {
      let data = snapshot.val();
      $(".trainAppend").empty();
      // console.log(data);
      let tag = 0;

      Object.values(data).forEach(train => {
        let trainName = train["trainName"]
        let destination = train["destination"]
        let frequency = train["frequency"]
        let firstTrain = train["firstTrain"]

        const momentStuff = function (frequency, firstTrain) {
          let firstTrainConv = moment(firstTrain, 'HH:mm').subtract(1, "years");
          currentTime = moment().format("LT");
          let timeDifference = moment().diff(moment(firstTrainConv), 'minutes');
          minutesLeft = timeDifference % frequency;
          nextTrainMins = frequency - minutesLeft;
          nextTrainArrival = moment().add(nextTrainMins, "minutes");
        };

        momentStuff(frequency, firstTrain);

        let newTr = $(`<tr class="${tag} x" id="${trainName}">`);

        newTr.append($(`<td>`).text(trainName));
        newTr.append($(`<td>`).text(destination));
        newTr.append($(`<td>`).text(frequency));
        newTr.append($(`<td>`).text(moment(nextTrainArrival).format("LT")));
        newTr.append($(`<td>`).text(nextTrainMins));
        newTr.append($(`<td>`).html(`<span class="close">×<span>`));

        $(".trainAppend").append(newTr);
        newTr.addClass(tag);
        tag++
      });
    };
    // If any errors are experienced, log them to console.
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });


  // submit button, adds new train
  $(".submitB").on("click", function (event) {

    event.preventDefault();

    let TrainName = $(".form1").val().trim();
    let Destination = $(".form2").val().trim();
    let FirstTrain = $(".form3").val().trim();
    let Frequency = $(".form4").val().trim();


    database.ref().push({
      trainName: TrainName,
      destination: Destination,
      firstTrain: FirstTrain,
      frequency: Frequency
    });

    $(".form1").val("");
    $(".form2").val("");
    $(".form3").val("");
    $(".form4").val("");

    trainNum++;
  });
});