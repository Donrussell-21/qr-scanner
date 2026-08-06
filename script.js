let html5QrCode;


function startScanner() {


    document.getElementById("status").innerHTML =
        "Starting camera...";


    html5QrCode = new Html5Qrcode("reader");


    html5QrCode.start(

        {
            facingMode: "environment"
        },

        {
            fps: 10,
            qrbox: 250
        },


        function(decodedText) {


            console.log(decodedText);


            let studentData = decodedText.split("-");


            document.getElementById("studentID").innerHTML =
                studentData[0] || "Unknown";


            document.getElementById("studentName").innerHTML =
                studentData[1] || "Unknown";


            document.getElementById("attendanceStatus").innerHTML =
                "Present";


            let now = new Date();


            document.getElementById("scanTime").innerHTML =
                now.toLocaleString();


            document.getElementById("status").innerHTML =
                "Scan Successful";


        },


        function(errorMessage) {

            // scanning errors ignored

        }

    )

    .catch(function(error){

        document.getElementById("status").innerHTML =
            "Camera Error: " + error;

    });


}




function stopScanner(){


    if(html5QrCode){


        html5QrCode.stop()

        .then(function(){


            html5QrCode.clear();


            document.getElementById("status").innerHTML =
                "Scanner stopped";


        })

        .catch(function(error){


            console.log(error);


        });


    }


}
