var recordsBool = false;
var bodyCamBool = false;
var gamePost = "https://cas-bodycam/";
var startedRecord = false;
var IntervalID;


window.addEventListener("message",function(event) {
    let data = event.data;
    console.log(data.action)
    if (data.action == "bodycam") {
        DisplayBodycam(!bodyCamBool, data.name, data.grade, data.header, data.desc,data.webhook)
    } else if (data.action == "records") {
        DisplayRecords(true, data.infos,data.header, data.footer)
    } else if (data == "resume") {
        if (mediaRecorder.state == !"recording") {
            mediaRecorder.resume()
        }
    } else if (data == "pause") {
        if (mediaRecorder.state == "recording") {
            mediaRecorder.pause()
        }
    }
})


const DisplayBodycam = function(show,name,grade, header,desc, webhook) {
    if (!show) {
        bodyCamBool = false
        StopRecording()
        $("div.bodycam-main").hide()
        clearInterval(IntervalID)
        $(".startNewRecord").attr("value", "start")
        $(".startNewRecord").html("Start New Record")
        return
    }
    $("div.bodycam-main").fadeIn(500,function() {
        $(this).css("display", "flex")
        bodyCamBool = true
        $("#rcName").html(name)
        $("#jobGrade").html(grade)
        StartTimeEvent()
        StartRecording(header, desc,webhook);
        $(".startNewRecord").attr("value", "stop")
        $(".startNewRecord").html("Stop Recording")
    })

}


  
var mediaRecorder;
const chunks = [];
var timer;

function StartRecording(name, desc,webhook) {
  var canvas = MainRender.createTempCanvas();
  var stream = canvas.captureStream(60);
  MainRender.renderToTarget(canvas);
  const options = {
    mimeType: 'video/webm; codecs=vp9'
  };
  mediaRecorder = new MediaRecorder(stream, options);

  mediaRecorder.ondataavailable = function (event) {
    chunks.push(event.data);
  };
  mediaRecorder.start();

  MainRender.animate();
  MainRender.resize(false);
  timer = setTimeout(function() {
    StopRecording();
    DisplayBodycam(false)
  }, 30000);

  mediaRecorder.onstop = function () {
    clearTimeout(timer);
    var blob = new Blob(chunks, { type: 'video/webm' });
    chunks.length = 0;
    var file = new File([blob], "video.webm");
    var formData = new FormData();
    formData.append("file", file);
    fetch(webhook, {
      method: 'POST',
      body: formData
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.attachments && data.attachments.length > 0) {
          var attachment = data.attachments[0];
          console.log('Dosya linki:', attachment.url);
          console.log("dosya ismi "+ name + desc)
          $.post(gamePost + "getVideoURL", JSON.stringify({
            videoURL: attachment.url,
            videoName: name,
            videoDesc: desc,
          }), function (result) {
            if (result == "ok") {
              console.log("Video saved to database.");
            }
          });
        } else {
          console.log('Dosya gönderilirken bir hata oluştu.');
        }
      })
      .catch(function (error) {
        console.error('Dosya gönderilirken bir hata oluştu:', error);
      });

    canvas.style.display = "none";
    MainRender.stop();
  };
}

  
var StopRecording = function() {
    console.log("stopped");
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    } else {
        console.log("not aktif")
    }
};




DisplayRecords = function(show,info,header,footer) {
    if (!show) {
        $("div.main-container").fadeOut(500)
        return
    }
    $(".ls-header").html(header)
    $(".ls-footer").html(footer)
    $("div.main-container").fadeIn(750, function() { //records
        recordsBool = true

    })
    $("div.records-main").empty()
    $.each(info, function(k,v) {

        var content = `
        <div class="recordBox">
                <div class="img-pick">
                    <img class="record-calimg" src="recordcalendar.png">
                </div>
                <div class="record-info-box">
                    <h1 class="record-headText">
                        ${v.recordName} | ${v.date} | ${v.hms}
                    </h1>
                    <p class="record-footText">
                        ${v.recordDetails}
                    </p>
                </div>
                <div class="recorder-name">
                    <img src="key.png">
                    ${v.recorder}
                </div>
                <div class="action-div">
                    <button class="plyRec" data-link="${v.videoLink}">Play Record</button>
                </div>
            </div>`
            $("div.records-main").append(content)
    })
    
}
$(document).on("click", ".plyRec", function() {
    var videoURL = $(this).data("link");
    if (videoURL) {
        $(".video-container").show()
        $("#myVideo").attr("src", videoURL)
    }
});




StartTimeEvent = function(){
    console.log("time vent")
    var counterElement = $(".infoBoxonBody.interval");
    var startTime = "00:00:00";
    var currentTime = startTime.split(":");
    var hours = parseInt(currentTime[0]);
    var minutes = parseInt(currentTime[1]);
    var seconds = parseInt(currentTime[2]);
    IntervalID = setInterval(function() {
      seconds++;
      if (seconds == 60) {
        seconds = 0;
        minutes++;
        if (minutes == 60) {
          minutes = 0;
          hours++;
          if (hours == 24) {
            hours = 0;
          }
        }
      }
      var formattedTime =
        ("0" + hours).slice(-2) +
        ":" +
        ("0" + minutes).slice(-2) +
        ":" +
        ("0" + seconds).slice(-2);

      counterElement.text(formattedTime);
    }, 1000);
    var dateElement = $(".infoBoxonBody.date");
    var currentDate = new Date();
    var day = ("0" + currentDate.getDate()).slice(-2);
    var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    var year = currentDate.getFullYear();
    dateElement.text(day + "/" + month + "/" + year);
}


window.addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 229) {
        return;
    }
    if (event.keyCode === 27) {
        if ($(".video-container").is(":visible")) {
            $(".video-container").hide();
        } else if ($(".settings-menu").is(":visible")) {
            $(".settings-menu").hide();
        } else {
            $(".main-container").hide();
            $.post(gamePost+"escapeFromNUI", {})
        }
    }
});


  $(document).ready(function() {
    $(document).on("click", "button.close-bodycam", function() {
        recordsBool = false
        DisplayRecords(recordsBool)
        $.post(gamePost+"escapeFromNUI", {})
    })

    $(document).on("click", ".close-input", function() {
        $(".settings-menu").fadeOut(300)
        $(".main-container").css("filter", "blur(0)")
    })
    $(document).on("click", ".startNewRecord", function() {
        if ($(this).attr("value") == "stop") {
            $(".startNewRecord").attr("value", "start")
            $(".startNewRecord").html("Start New Record")
            DisplayBodycam(false) 
            return
        }
        $(".settings-menu").fadeIn(300)
        $(".main-container").css("filter", "blur(5px)")
    })
    $(document).on("click", "#startRecord", function() {
        let recName = $(".name").val();
        let fps = $(".fps").val();
        let desc = $(".desc").val();
        if ($(".startNewRecord").attr("value") == "start") {
            console.log("start")
            if (recName !== "" && fps !== "" && desc !== "") {
                $(".settings-menu").fadeOut(300);
                $(".main-container").css("filter", "blur(0px)");
                $(".main-container").hide();
                $.post(gamePost+"escapeFromNUI", {})
                $(".name").val("");
                $(".fps").val("");
                $(".desc").val("");
                StartRecording(recName, fps, desc);
                DisplayBodycam(true);
                $(".startNewRecord").attr("value", "stop")
                $(".startNewRecord").html("Stop Recording")
            }
        }
    });
})

$(document).on("input", "input", function() {
    var inputVal = $(this).val().trim();
    var imageSrc = inputVal ? "yes.png" : "close.png";
    $(this).closest(".input-box").find("img").attr("src", imageSrc);
});

$(document).ready(function() {

  $('.datepickerBtn').datepicker({
    dateFormat: "M dd, yy",
    onSelect: function(dateText, inst) {
      console.log("Tarih seçildi: " + dateText);
      filterRecordsByDate(dateText);
    }
  });
  
  $('.datepickerBtn').on('change', function() {
    var selectedDate = $(this).datepicker('getDate');
    if (selectedDate) {
      var formattedDate = $.datepicker.formatDate('M dd, yy', selectedDate);
      $(this).val(formattedDate);
    }
  });

  $('.leftBtn').on('click', function() {
    var currentDate = $('.datepickerBtn').datepicker('getDate');
    if (currentDate) {
      var previousDate = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000));
      $('.datepickerBtn').datepicker('setDate', previousDate);
      var formattedDate = $.datepicker.formatDate('M dd, yy', previousDate);
      $('.datepickerBtn').val(formattedDate);
      filterRecordsByDate(formattedDate);
    }
  });

  $('.rightBtn').on('click', function() {
    var currentDate = $('.datepickerBtn').datepicker('getDate');
    if (currentDate) {
      var nextDate = new Date(currentDate.getTime() + (24 * 60 * 60 * 1000));
      $('.datepickerBtn').datepicker('setDate', nextDate);
      var formattedDate = $.datepicker.formatDate('M dd, yy', nextDate);
      $('.datepickerBtn').val(formattedDate);
      filterRecordsByDate(formattedDate);
    }
  });

  function filterRecordsByDate(selectedDate) {
    $('.recordBox').each(function() {
      var recordDate = $(this).find('.record-headText').text().split(' | ')[1].trim();
      var formattedRecordDate = $.datepicker.formatDate('M dd, yy', new Date(recordDate));
      var formattedSelectedDate = $.datepicker.formatDate('M dd, yy', new Date(selectedDate));
      console.log(formattedRecordDate, formattedSelectedDate);
      
      if (formattedRecordDate === formattedSelectedDate) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }
  
});


  
