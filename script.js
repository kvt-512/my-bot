try {
  var SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
} catch (e) {
  console.error(e);
  $(".no-browser-support").show();
  $(".app").hide();
}
var ans;

var noteTextarea = $("#note-textarea");
var instructions = $("#recording-instructions");
var notesList = $("ul#notes");

var noteContent = "";
let message = "";

// Get all notes from previous sessions and display them.
//   var notes = getAllNotes();
//   renderNotes(notes);

/*----------------------------------------------------------------------
READ OUT LOUD
-----------------------------------------------------------------------*/
const msgonend = () => {
  console.log("stating to recog");
  noteTextarea.val("");
  noteContent = "";
  ans = "";
  recognition.start();
};

const readOutLoud = (message) => {
  // let speech = new SpeechSynthesisUtterance();

  responsiveVoice.setDefaultVoice("US English Female");
  responsiveVoice.speak(message, "US English Female", {
    onend: function () {
      msgonend();
    },
  });
};
//----------------------------------------------------------------------

/*----------------------------------------------------------------------
AXIOS REQUEST
-----------------------------------------------------------------------*/
const getData = () => {
  axios
    .get(
      `https://api.scaleserp.com/search?api_key=A8A60F4153DD4485BCAAEED1E58E315A&q=${noteContent}&google_domain=google.co.in&location=Bengaluru%2CKarnataka%2CIndia&gl=in&hl=en`
      // `https://reqres.in/api/users`
    )
    .then((res) => {
      if (res) {
        // if (res && res.data.answer_box) {
        //   if (res && res.data.answer_box.answers) {
        //     console.log(res.data.answer_box.answers[0].answer);
        //     message = res.data.answer_box.answers[0].answer;
        //   }
        // } else {
        //   console.log(res.data.organic_results[0].snippet);
        //   message = res.data.organic_results[0].snippet;
        // }
        // res.data.organic_results[res.data.organic_results.length - 1].snippet;
        try {
          console.log(res.data.answer_box.answers[0].answer);
          message = res.data.answer_box.answers[0].answer;
        } catch (err) {
          try {
            console.log(res.data.organic_results[0].snippet);
            message = res.data.organic_results[0].snippet;
          } catch (err) {
            try {
              console.log(res.data.related_questions[0].answer);
              message = res.data.related_questions[0].answer;
            } catch (err) {
              console.log("not found");
              message = "not found";
            }
          }
        }
        ans = message;
        noteTextarea.val("YOU: " + noteContent + "\n\n" + "BOT: " + ans);
        readOutLoud(message);
      }
    });
};
//---------------------------------------------------------------------------

/*-----------------------------
        Voice Recognition 
  ------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses.
recognition.continuous = true;

// This block is called every time the Speech APi captures a line.
recognition.onresult = function (event) {
  // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far.
  // We only need the current one.
  var current = event.resultIndex;

  // Get a transcript of what was said.
  var transcript = event.results[current][0].transcript;
  console.log(event.results[current][0].transcript);

  // Add the current transcript to the contents of our Note.
  // There is a weird bug on mobile, where everything is repeated twice.
  // There is no official solution so far so we have to handle an edge case.
  var mobileRepeatBug =
    current == 1 && transcript == event.results[0][0].transcript;

  if (!mobileRepeatBug) {
    noteContent += transcript.toLowerCase();
    recognition.stop();
    // noteTextarea.val(message);

    if (
      noteContent == "hi" ||
      noteContent == "hello" ||
      noteContent == "hey" ||
      noteContent == "what is your name"
    ) {
      ans = "Hi, Iam Reva Bot of Reva University. How can I help you?";
      responsiveVoice.speak(ans, "US English Female", {
        onend: function () {
          msgonend();
        },
      });
    } else if (noteContent == "how are you" || noteContent == "how do you do") {
      ans = "I am fine. How are you?";
      responsiveVoice.speak(ans, "US English Female", {
        onend: function () {
          msgonend();
        },
      });
    } else if (noteContent == "where am I") {
      ans = "You are at prestagious Reva University";
      responsiveVoice.speak(ans, "US English Female", {
        onend: function () {
          msgonend();
        },
      });
    } else if (noteContent == "i love you") {
      ans = "Oh yeah! I love you too";
      responsiveVoice.speak(ans, "US English Female", {
        onend: function () {
          msgonend();
        },
      });
    } else if (noteContent == "do you love me") {
      ans = "i am very much in love with you";
      responsiveVoice.speak(ans, "US English Female", {
        onend: function () {
          msgonend();
        },
      });
    } else if (noteContent == "What is your name" || noteContent == "what's your name") {
      ans = "my name is reva bot";
      responsiveVoice.speak(ans, "US English Female", {
        onend: function () {
          msgonend();
        },
      });
    } else if (
      noteContent == "bye" ||
      noteContent == "thank you" ||
      noteContent == "thanks" ||
      noteContent == "okay bye" ||
      noteContent == "ok bye"
    ) {
      ans = "have a nice day";
      responsiveVoice.speak(ans, "US English Female", {
        onend: function () {
          msgonend();
        },
      });
    } else {
      getData(noteContent);
    }

    noteTextarea.val("YOU: " + noteContent + "\n\n" + "BOT: " + ans);
  }
};

recognition.onstart = function () {
  instructions.text(
    "Voice recognition activated. Try speaking into the microphone."
  );
};

recognition.onsoundend = () => {
  console.log("end");
};

// recognition.onspeechend = function () {
//   instructions.text(
//     "You were quiet for a while so voice recognition turned itself off."
//   );
// };

recognition.onerror = function (event) {
  if (event.error == "no-speech") {
    instructions.text("No speech was detected. Try again.");
  }
};

/*-----------------------------
        App buttons and input 
  ------------------------------*/
window.onload = function () {
  document.querySelector("#start-record-btn").disabled = true;
  responsiveVoice.speak(
    "Hi, Iam Reva Bot of Reva University. How can I help you?",
    "US English Female",
    {
      onend: function () {
        msgonend();
      },
    }
  );
};

if (noteContent == "") {
  recognition.onsoundend = () => {
    console.log("recog stopped");
    document.querySelector("#start-record-btn").disabled = false;
  };
}

$("#start-record-btn").on("click", function (e) {
  // if (noteContent.length) {
  //   noteContent += " ";
  // }
  // recognition.start();
  // recognition.onsoundstart = () => {
  //   document.querySelector("#start-record-btn").disabled = true;
  // };
  window.location.reload();
});

// $("#pause-record-btn").on("click", function (e) {
//   recognition.stop();
//   instructions.text("Voice recognition paused.");
// });

// Sync the text inside the text area with the noteContent variable.
noteTextarea.on("input", function () {
  noteContent = $(this).val();
});

//   $('#save-note-btn').on('click', function(e) {
//     recognition.stop();

//     if(!noteContent.length) {
//       instructions.text('Could not save empty note. Please add a message to your note.');
//     }
//     else {
//       // Save note to localStorage.
//       // The key is the dateTime with seconds, the value is the content of the note.
//       saveNote(new Date().toLocaleString(), noteContent);

//       // Reset variables and update UI.
//       noteContent = '';
//       renderNotes(getAllNotes());
//       noteTextarea.val('');
//       instructions.text('Note saved successfully.');
//     }

//   })

//   notesList.on('click', function(e) {
//     e.preventDefault();
//     var target = $(e.target);

//     // Listen to the selected note.
//     if(target.hasClass('listen-note')) {
//       var content = target.closest('.note').find('.content').text();
//       readOutLoud(content);
//     }

//     // Delete note.
//     if(target.hasClass('delete-note')) {
//       var dateTime = target.siblings('.date').text();
//       deleteNote(dateTime);
//       target.closest('.note').remove();
//     }
//   });

/*-----------------------------
        Speech Synthesis 
  ------------------------------*/

// const readOutLoud = (message) => {
//   responsiveVoice.setDefaultVoice("US English Female");
//   responsiveVoice.speak(message);
// };

// function readOutLoud(message) {
//   var speech = new SpeechSynthesisUtterance();
//   var voices = window.speechSynthesis.getVoices();

//   // Set the text and voice attributes.
//   speech.text = message;
//   speech.volume = 1;
//   speech.rate = 1;
//   speech.pitch = 1;

//   speech.voice = voices[2]
//   speech.voice = speechSynthesis.getVoices().filter(function (voice) {
//     return voice.name == "Google UK English Female";
//   })[0];

//   window.speechSynthesis.speak(speech);

//   speech.onend = () => {
//     recognition.start();
//   };
// }

/* AXIOS */
// const getData = () => {
//   if (noteContent != "") {
//     console.log(noteContent)
//     axios
//       .get(
//         `https://api.scaleserp.com/search?api_key=CB0C87F01EAB40B89C7B4D3E23D384F1&q=${noteContent}&google_domain=google.co.in&location=Bengaluru,Karnataka,India&gl=in&hl=en`
//         // `https://reqres.in/api/users`
//       )
//       .then((res) => {
//         if (res) {
//           if (res && res.data.answer_box) {
//             if (res && res.data.answer_box.answers) {
//               console.log(res.data.answer_box.answers[0].answer);
//               message = res.data.answer_box.answers[0].answer;
//             }
//           } else {
//             console.log(res.data.organic_results[0].snippet);
//             message = res.data.organic_results[0].snippet;
//           }
//           // res.data.organic_results[res.data.organic_results.length - 1].snippet;

//           readOutLoud(message);
//         }
//       });
//   }
// };

// getData();

// if (noteContent) {
//   readOutLoud(noteContent);
// }

// $("#read-note-btn").on("click", function (e) {
//   readOutLoud(noteContent);
//   // recognition.start();
// });

//In-active state reload
// recognition.onaudioend = () => {
//   if (!responsiveVoice.isPlaying()) {
//     setTimeout(() => {
//       recognition.start();
//     }, 5000);
//   }
// };

recognition.addEventListener("speechend", function () {
  if (noteContent == "") {
    console.log("no content");
    setTimeout(() => {
      recognition.start();
      // alert("mic turnd off")
    }, 1000);
  }
});

// setTimeout(recognition.start(), 10000)

/*-----------------------------
        Helper Functions 
  ------------------------------*/

//   function renderNotes(notes) {
//     var html = '';
//     if(notes.length) {
//       notes.forEach(function(note) {
//         html+= `<li class="note">
//           <p class="header">
//             <span class="date">${note.date}</span>
//             <a href="#" class="listen-note" title="Listen to Note">Listen to Note</a>
//             <a href="#" class="delete-note" title="Delete">Delete</a>
//           </p>
//           <p class="content">${note.content}</p>
//         </li>`;
//       });
//     }
//     else {
//       html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
//     }
//     notesList.html(html);
//   }

//   function saveNote(dateTime, content) {
//     localStorage.setItem('note-' + dateTime, content);
//   }

//   function getAllNotes() {
//     var notes = [];
//     var key;
//     for (var i = 0; i < localStorage.length; i++) {
//       key = localStorage.key(i);
//       console.log(i)
//       console.log(key)

//       if(key.substring(0,5) == 'note-') {
//         notes.push({
//           date: key.replace('note-',''),
//           content: localStorage.getItem(localStorage.key(i))
//         });
//       }
//     }
//     console.log(notes)
//     return notes;
//   }

//   function deleteNote(dateTime) {
//     localStorage.removeItem('note-' + dateTime);
//   }
