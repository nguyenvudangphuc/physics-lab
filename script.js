
const volumeInput = document.getElementById("volume");
const volumeValue = document.getElementById("volumeValue");
const pressureValue = document.getElementById("pressureValue");
const pvValue = document.getElementById("pvValue");
const gas = document.getElementById("gas");
const piston = document.getElementById("piston");
const dataTable = document.getElementById("dataTable");

const K = 1000; // P × V không đổi
let measurements = [];

const ctx = document.getElementById("pvChart");

const chart = new Chart(ctx, {
    type: "line",
    data: {
        datasets: [
            {
                label: "Đường đẳng nhiệt",
                data: [],
                borderColor: "#42d9f5",
                backgroundColor: "rgba(66,217,245,0.12)",
                borderWidth: 3,
                pointRadius: 0,
                tension: 0.3
            },
            {
                label: "Trạng thái hiện tại",
                data: [],
                borderColor: "#ffffff",
                backgroundColor: "#ffffff",
                pointRadius: 7,
                showLine: false
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: "#a8b7ca"
                }
            }
        },
        scales: {
            x: {
                type: "linear",
                title: {
                    display: true,
                    text: "Thể tích (L)",
                    color: "#a8b7ca"
                },
                min: 2,
                max: 20,
                ticks: { color: "#a8b7ca" },
                grid: { color: "#203149" }
            },
            y: {
                title: {
                    display: true,
                    text: "Áp suất (kPa)",
                    color: "#a8b7ca"
                },
                min: 0,
                max: 550,
                ticks: { color: "#a8b7ca" },
                grid: { color: "#203149" }
            }
        }
    }
});

function updateExperiment() {
    const V = Number(volumeInput.value);
    const P = K / V;

    volumeValue.textContent = V.toFixed(1) + " L";
    pressureValue.textContent = P.toFixed(1);
    pvValue.textContent = (P * V).toFixed(1);

    // Thay đổi hình ảnh piston
    const gasHeight = 100 * V / 20;
    gas.style.height = gasHeight + "%";

    const pistonTop = 198 - gasHeight * 1.9;
    piston.style.top = pistonTop + "px";

    // Cập nhật biểu đồ
    const curve = [];

    for (let v = 2; v <= 20; v += 0.25) {
        curve.push({
            x: v,
            y: K / v
        });
    }

    chart.data.datasets[0].data = curve;
    chart.data.datasets[1].data = [{ x: V, y: P }];

    chart.update("none");
}

function renderTable() {
    dataTable.innerHTML = "";

    measurements.forEach((item, index) => {
        const row = document.createElement("tr");

        [index + 1, item.V.toFixed(1),
         item.P.toFixed(1), item.PV.toFixed(1)]
        .forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        dataTable.appendChild(row);
    });
}

volumeInput.addEventListener("input", updateExperiment);

document.getElementById("addBtn").addEventListener("click", () => {
    const V = Number(volumeInput.value);
    const P = K / V;

    measurements.push({
        V: V,
        P: P,
        PV: V * P
    });

    renderTable();
});

document.getElementById("clearBtn").addEventListener("click", () => {
    measurements = [];
    renderTable();
});

document.getElementById("resetBtn").addEventListener("click", () => {
    volumeInput.value = 10;
    updateExperiment();
});

updateExperiment();
