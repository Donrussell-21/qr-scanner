let html5QrCode = null;


function startScanner() {

    alert("Start Scanner button works!");

    document.getElementById("scanMessage").innerHTML =
        "Starting camera...";

    html5QrCode = new Html5Qrcode("reader");

    ...
}



function stopScanner(){


    if(html5QrCode){


        html5QrCode.stop()

        .then(()=>{


            html5QrCode.clear();


        })

        .catch(err=>{


            console.log(err);


        });


    }


}



function checkStudent(studentID){


    console.log("Student ID:", studentID);


    // temporary display only
    // connect Google Apps Script here later


}
