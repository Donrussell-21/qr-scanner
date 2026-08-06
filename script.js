let html5QrCode = null;

function startScanner() {

    document.getElementById("result").innerHTML = "Starting camera...";

    html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras()
        .then(cameras => {

            if (cameras.length === 0) {
                document.getElementById("result").innerHTML =
                    "No camera found.";
                return;
            }

            return html5QrCode.start(
                cameras[0].id,
                {
                    fps: 10,
                    qrbox: 250
                },

                function (decodedText) {

                    stopScanner();

                    checkStudent(decodedText);

                },

                function () {
                    // Ignore scan errors
                }

            );

        })

        .catch(err => {

            console.error(err);

            document.getElementById("result").innerHTML =
                "Camera Error: " + err;

        });

}

function stopScanner() {

    if (html5QrCode) {

        html5QrCode.stop()

            .then(() => {

                html5QrCode.clear();

                html5QrCode = null;

            })

            .catch(console.error);

    }

}

function checkStudent(studentID) {

    fetch(
        "https://script.google.com/macros/s/AKfycbw_-oNTjvLFL6tw2y0iqgVImo01GQPumqS1xyDiSMAECfhgvDLDjU-YW6zIiWIdO_Tu2g/exec?id="
        + encodeURIComponent(studentID)
    )

    .then(res => res.json())

    .then(data => {

        if (data.found) {

            document.getElementById("result").innerHTML = `
                <h3>${data.name}</h3>
                <p>${data.id}</p>
                <p style="color:green;">Attendance Recorded</p>
            `;

        } else {

            document.getElementById("result").innerHTML =
                "Student not found.";

        }

    })

    .catch(err => {

        console.error(err);

        document.getElementById("result").innerHTML =
            "Unable to connect.";

    });

}
