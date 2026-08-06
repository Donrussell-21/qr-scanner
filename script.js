// ======================================
// QR Attendance Scanner
// ======================================

const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyvAr2oR5aiI-8PGewzcWkh545qMm3J3bohOx5CM3FdWOn9OBEGYV6QNvsifLvZPVQGng/exec";

let html5QrCode;
let scannerRunning = false;

// =========================
// Start Scanner
// =========================
function startScanner() {

    if (scannerRunning) return;

    html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras()
        .then(cameras => {

            if (cameras.length === 0) {

                document.getElementById("status").className = "alert alert-danger";
                document.getElementById("status").innerHTML = "No webcam detected.";

                return;
            }

            scannerRunning = true;

            html5QrCode.start(

                cameras[0].id,

                {
                    fps: 10,
                    qrbox: 250
                },

                onScanSuccess

            );

        })

        .catch(error => {

            document.getElementById("status").className = "alert alert-danger";
            document.getElementById("status").innerHTML = error;

        });

}

// =========================
// Stop Scanner
// =========================
function stopScanner() {

    if (!scannerRunning) return;

    html5QrCode.stop().then(() => {

        scannerRunning = false;

    });

}

// =========================
// QR Detected
// =========================
function onScanSuccess(decodedText) {

    stopScanner();

    document.getElementById("status").className = "alert alert-warning";
    document.getElementById("status").innerHTML = "Processing attendance...";

    fetch(WEBAPP_URL, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            studentID: decodedText

        })

    })

    .then(response => response.json())

    .then(result => {

        if(result.success){

            document.getElementById("studentID").innerHTML =
                result.student.studentID;

            document.getElementById("studentName").innerHTML =
                result.student.lastName + ", " +
                result.student.firstName;

            document.getElementById("attendanceStatus").innerHTML =
                result.type;

            document.getElementById("status").className =
                "alert alert-success";

            document.getElementById("status").innerHTML =
                result.message;

        }

        else{

            document.getElementById("status").className =
                "alert alert-danger";

            document.getElementById("status").innerHTML =
                result.message;

        }

        setTimeout(function(){

            startScanner();

        },2000);

    })

    .catch(error=>{

        document.getElementById("status").className =
            "alert alert-danger";

        document.getElementById("status").innerHTML =
            error;

        setTimeout(function(){

            startScanner();

        },2000);

    });

}
