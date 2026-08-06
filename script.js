let html5QrCode = null;


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


            console.log("QR:", decodedText);


            let data = decodedText.split("-");


            document.getElementById("studentID").innerHTML =
                data[0] || "Unknown";


            document.getElementById("studentName").innerHTML =
                data[1] || "Unknown";


            document.getElementById("attendanceStatus").innerHTML =
                "Present";


            document.getElementById("scanTime").innerHTML =
                new Date().toLocaleString();


            document.getElementById("status").innerHTML =
                "Attendance Recorded";


        },


        function(errorMessage) {

            // ignore scanning errors

        }

    )

    .catch(function(error) {


        document.getElementById("status").innerHTML =
            "Camera Error: " + error;


    });


}




function stopScanner() {


    if(html5QrCode) {


        html5QrCode.stop()

        .then(function() {


            html5QrCode.clear();


            document.getElementById("status").innerHTML =
                "Scanner stopped";


        })

        .catch(function(error) {


            console.log(error);


        });


    }


}
