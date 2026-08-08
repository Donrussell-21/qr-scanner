let html5QrCode = null;
let scannerRunning = false;

const databaseURL =
    "https://script.google.com/macros/s/AKfycbw_-oNTjvLFL6tw2y0iqgVImo01GQPumqS1xyDiSMAECfhgvDLDjU-YW6zIiWIdO_Tu2g/exec";


/*************************************************
 * START SCANNER
 *************************************************/

function startScanner() {

    if (scannerRunning) return;

    if (!html5QrCode) {
        html5QrCode =
            new Html5Qrcode("reader");
    }

    html5QrCode.start(

        { facingMode: "environment" },

        {
            fps: 10,
            qrbox: 250
        },

        onScanSuccess,

        function () {
            // Ignore QR scanning errors
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


/*************************************************
 * QR SCAN SUCCESS
 *************************************************/

function onScanSuccess(decodedText) {

    if (!scannerRunning) return;

    // Prevent multiple scans
    scannerRunning = false;


    html5QrCode.stop().then(() => {

        document.getElementById("status").innerHTML =
            "Checking student...";


        /*******************************************
         * SEND STUDENT ID TO GOOGLE APPS SCRIPT
         *******************************************/

        fetch(
            databaseURL +
            "?action=scan&id=" +
            encodeURIComponent(decodedText)
        )

        .then(response => response.json())

        .then(student => {

            console.log(
                "SCAN RESPONSE:",
                student
            );


            document.getElementById("resultCard").style.display =
                "block";


            /*****************************************
             * SUCCESSFUL RESPONSE
             *****************************************/

            if (
                student.success &&
                student.found
            ) {

                document.getElementById("studentID").innerHTML =
                    student.id;


                document.getElementById("studentName").innerHTML =
                    student.name;


                document.getElementById("studentTrack").innerHTML =
                    student.track;


                document.getElementById("studentGrade").innerHTML =
                    student.grade;


                /*****************************************
                 * DISPLAY STATUS
                 *
                 * STATUS SHOULD NOW BE:
                 *
                 * Present
                 *
                 *****************************************/

                document.getElementById("attendanceStatus").innerHTML =
                    student.status ||
                    student.attendance ||
                    "Present";


                /*****************************************
                 * DISPLAY TIME
                 *****************************************/

                document.getElementById("scanTime").innerHTML =
                    student.time;


                /*****************************************
                 * DISPLAY SCAN RESULT
                 *****************************************/

                const status =
                    student.status ||
                    student.attendance ||
                    "";


                const remarks =
                    student.remarks ||
                    "";


                /*****************************************
                 * DUPLICATE
                 *****************************************/

                if (
                    student.duplicate === true ||
                    status === "Already Timed In" ||
                    student.attendance === "Already Timed In"
                ) {

                    document.getElementById("status").innerHTML =
                        "🔵 ALREADY TIMED IN — No New Entry";

                }


                /*****************************************
                 * PRESENT + LATE
                 *****************************************/

                else if (
                    status === "Present" &&
                    remarks === "Late"
                ) {

                    document.getElementById("status").innerHTML =
                        "🟠 PRESENT — LATE";

                }


                /*****************************************
                 * PRESENT + ON TIME
                 *****************************************/

                else if (
                    status === "Present" &&
                    remarks === "On Time"
                ) {

                    document.getElementById("status").innerHTML =
                        "🟢 PRESENT — ON TIME";

                }


                /*****************************************
                 * PRESENT
                 *****************************************/

                else if (
                    status === "Present"
                ) {

                    document.getElementById("status").innerHTML =
                        "🟢 PRESENT — Attendance Recorded";

                }


                /*****************************************
                 * FALLBACK
                 *****************************************/

                else {

                    document.getElementById("status").innerHTML =
                        "Attendance Recorded";

                }

            }


            /*****************************************
             * STUDENT NOT FOUND
             *****************************************/

            else {

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
                    "🔴 " +
                    (
                        student.message ||
                        "Student Not Found"
                    );

            }

        })


        /*******************************************
         * DATABASE ERROR
         *******************************************/

        .catch(err => {

            console.error(
                "DATABASE ERROR:",
                err
            );


            document.getElementById("status").innerHTML =
                "🔴 Database Error";

        });

    });

}


/*************************************************
 * STOP SCANNER
 *************************************************/

function stopScanner() {

    if (
        !html5QrCode ||
        !scannerRunning
    ) return;


    html5QrCode.stop().then(() => {

        scannerRunning = false;


        document.getElementById("status").innerHTML =
            "Scanner Stopped";

    });

}
