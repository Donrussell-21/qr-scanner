let html5QrCode = null;

// =======================
// START SCANNER
// =======================
function startScanner() {

    document.getElementById("result").innerHTML =
        "Starting camera...";

    // Prevent multiple instances
    if (html5QrCode) {
        stopScanner();
    }

    html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras()
        .then(cameras => {

            if (!cameras || cameras.length === 0) {
                document.getElementById("result").innerHTML =
                    "<span class='error'>No camera detected.</span>";
                return;
            }

            // Use the first available camera (works on laptops)
            const cameraId = cameras[0].id;

            html5QrCode.start(
                cameraId,
                {
                    fps: 10,
                    qrbox: {
                        width: 250,
                        height: 250
                    }
                },

                // QR Success
                function (decodedText) {

                    stopScanner();

                    document.getElementById("result").innerHTML =
                        "Checking student...";

                    checkStudent(decodedText);

                },

                // Ignore scan errors
                function () { }

            );

        })

        .catch(err => {

            console.error(err);

            document.getElementById("result").innerHTML =
                "<span class='error'>Camera Error:<br>" + err + "</span>";

        });

}


// =======================
// STOP SCANNER
// =======================
function stopScanner() {

    if (html5QrCode) {

        html5QrCode.stop()

            .then(() => {

                html5QrCode.clear();

                html5QrCode = null;

            })

            .catch(err => {

                console.log(err);

            });

    }

}


// =======================
// CHECK STUDENT
// =======================
function checkStudent(studentID) {

    const url =
        "https://script.google.com/macros/s/AKfycbw_-oNTjvLFL6tw2y0iqgVImo01GQPumqS1xyDiSMAECfhgvDLDjU-YW6zIiWIdO_Tu2g/exec?id="
        + encodeURIComponent(studentID);

    fetch(url)

        .then(response => response.json())

        .then(data => {

            if (data.found) {

                document.getElementById("result").innerHTML = `
                    <div class="student-info">
                        <p><strong>Name:</strong> ${data.name}</p>
                        <p><strong>ID:</strong> ${data.id}</p>
                        <p class="success">Attendance Recorded</p>
                    </div>
                `;

            } else {

                document.getElementById("result").innerHTML = `
                    <div class="error">
                        Student not found.
                    </div>
                `;

            }

        })

        .catch(error => {

            console.error(error);

            document.getElementById("result").innerHTML =
                "<span class='error'>Unable to contact server.</span>";

        });

}
