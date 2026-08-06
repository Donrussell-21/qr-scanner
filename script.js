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

    const url =
    "https://script.google.com/macros/s/AKfycbw_-oNTjvLFL6tw2y0iqgVImo01GQPumqS1xyDiSMAECfhgvDLDjU-YW6zIiWIdO_Tu2g/exec?id="
    + encodeURIComponent(studentID);

    console.log("Request URL:", url);

    fetch(url)
        .then(response => {
            console.log("HTTP Status:", response.status);
            return response.text();
        })
        .then(text => {

            console.log("Server Response:", text);

            const data = JSON.parse(text);

            if(data.found){

                document.getElementById("result").innerHTML = `
                    <h3>${data.name}</h3>
                    <p>${data.id}</p>
                    <p style="color:green;">Attendance Recorded</p>
                `;

            }else{

                document.getElementById("result").innerHTML =
                    "Student not found.";

            }

        })
        .catch(error => {

            console.error("Fetch Error:", error);

            document.getElementById("result").innerHTML = `
                <pre>${error}</pre>
            `;

        });

}
