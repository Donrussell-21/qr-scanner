let html5QrCode = null;
let scannerRunning = false;

const databaseURL = "https://script.google.com/macros/s/AKfycbw_-oNTjvLFL6tw2y0iqgVImo01GQPumqS1xyDiSMAECfhgvDLDjU-YW6zIiWIdO_Tu2g/exec";

function startScanner() {

    if (scannerRunning) {
        return;
    }

    document.getElementById("status").innerHTML = "Starting camera...";

    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("reader");
    }

    html5QrCode.start(
        {
            facingMode: "environment"
        },
        {
            fps: 10,
            qrbox: 250
        },
        onScanSuccess,
        function () {
            // Ignore scan errors
        }
    ).then(() => {

        scannerRunning = true;
        document.getElementById("status").innerHTML = "Ready to scan.";

    }).catch(err => {

        console.error(err);
        document.getElementById("status").innerHTML = "Unable to open camera.";

    });

}

function onScanSuccess(decodedText) {
    console.log("QR Detected:", decodedText);
alert("QR: " + decodedText);

    if (!scannerRunning) return;

    scannerRunning = false;

    document.getElementById("status").innerHTML = "Checking student...";

    html5QrCode.stop().then(() => {

        fetch(databaseURL + "?id=" + encodeURIComponent(decodedText))

            .then(response => response.json())

            .then(student => {

                document.getElementById("resultCard").style.display = "block";

                if (student.found) {

                    document.getElementById("studentID").innerHTML = student.id;
                    document.getElementById("studentName").innerHTML = student.name;
                    document.getElementById("studentGrade").innerHTML = student.grade;
                    document.getElementById("attendanceStatus").innerHTML = student.attendance || "Present";
                    document.getElementById("scanTime").innerHTML = new Date().toLocaleString();
                    document.getElementById("status").innerHTML = "Attendance recorded successfully.";

                } else {

                    document.getElementById("studentID").innerHTML = decodedText;
                    document.getElementById("studentName").innerHTML = "Student not found";
                    document.getElementById("studentGrade").innerHTML = "-";
                    document.getElementById("attendanceStatus").innerHTML = "Invalid";
                    document.getElementById("scanTime").innerHTML = "-";
                    document.getElementById("status").innerHTML = "Student not found.";

                }

            })

            .catch(err => {

                console.error(err);
                document.getElementById("status").innerHTML = "Database connection error.";

            });

    });

}

function stopScanner() {

    if (!html5QrCode || !scannerRunning) {
        return;
    }

    html5QrCode.stop().then(() => {

        scannerRunning = false;
        document.getElementById("status").innerHTML = "Scanner stopped.";

    }).catch(err => console.error(err));

}
