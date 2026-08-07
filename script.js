
let html5QrCode = null;
let scannerRunning = false;

const databaseURL = "https://script.google.com/macros/s/AKfycbw_-oNTjvLFL6tw2y0iqgVImo01GQPumqS1xyDiSMAECfhgvDLDjU-YW6zIiWIdO_Tu2g/exec";

function startScanner() {

    if (scannerRunning) return;

    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("reader");
    }

    html5QrCode.start(

        { facingMode: "environment" },

        {
            fps: 10,
            qrbox: 250
        },

        onScanSuccess,

        function () {
            // ignore scan errors
        }

    ).then(() => {

        scannerRunning = true;

        document.getElementById("status").innerHTML =
            "Scanner Ready";

    }).catch(err => {

        console.error(err);

        document.getElementById("status").innerHTML =
            "Camera Error";

    });

}

function onScanSuccess(decodedText) {

    if (!scannerRunning) return;

    scannerRunning = false;

    html5QrCode.stop().then(() => {

        document.getElementById("status").innerHTML =
            "Checking student...";

        fetch(
            databaseURL +
            "?action=scan&id=" +
            encodeURIComponent(decodedText)
        )

        .then(response => response.json())

        .then(student => {

            console.log(student);

            document.getElementById("resultCard").style.display =
                "block";

            if (student.success && student.found) {

                document.getElementById("studentID").innerHTML =
                    student.id;

                document.getElementById("studentName").innerHTML =
                    student.name;

                document.getElementById("studentTrack").innerHTML =
                    student.track;

                document.getElementById("studentGrade").innerHTML =
                    student.grade;

                document.getElementById("attendanceStatus").innerHTML =
                    student.attendance;

                document.getElementById("scanTime").innerHTML =
                    student.time;

                document.getElementById("status").innerHTML =
                    "Attendance Recorded";

            } else {

                document.getElementById("studentID").innerHTML =
                    decodedText;

                document.getElementById("studentName").innerHTML =
                    "Student Not Found";

                document.getElementById("studentTrack").innerHTML =
                    "-";

                document.getElementById("studentGrade").innerHTML =
                    "-";

                document.getElementById("attendanceStatus").innerHTML =
                    "-";

                document.getElementById("scanTime").innerHTML =
                    "-";

                document.getElementById("status").innerHTML =
                    student.message;

            }

        })

        .catch(err => {

            console.error(err);

            document.getElementById("status").innerHTML =
                "Database Error";

        });

    });

}

function stopScanner() {

    if (!html5QrCode || !scannerRunning) return;

    html5QrCode.stop().then(() => {

        scannerRunning = false;

        document.getElementById("status").innerHTML =
            "Scanner Stopped";

    });

}
