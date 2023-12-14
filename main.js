const localtunnel = require("localtunnel");
const axios = require("axios");

const baseUrl = "https://simvitation.loca.lt";
const PORT = 9123;

const tunnelOptions = {
  subdomain: "simvitation", // Ganti dengan subdomain yang ingin Anda gunakan
};

let tunnel;

function createTunnel() {
  tunnel = localtunnel(PORT, tunnelOptions, (error, tunnel) => {
    if (error) {
      console.error(
        `[${new Date().toLocaleString()}] Error creating localtunnel:`,
        error.message
      );
      // Coba lagi setelah beberapa detik
      setTimeout(createTunnel, 5000);
    } else {
      console.log(
        `[${new Date().toLocaleString()}] Localtunnel URL: ${tunnel.url}`
      );
    }
  });

  tunnel.on("close", () => {
    console.log(
      `[${new Date().toLocaleString()}] Localtunnel connection closed`
    );
    // Reconnect setelah beberapa detik
    setTimeout(createTunnel, 5000);
  });
}

// Membuat tunnel saat aplikasi dimulai
createTunnel();

// Contoh penggunaan Axios untuk memantau ketersediaan localtunnel
function checkTunnelStatus() {
  axios
    .get(baseUrl) // Ganti dengan URL aplikasi lokal Anda
    .then(() => {
      console.log(`[${new Date().toLocaleString()}] Berhasil Fetching API`);
    })
    .catch(() => {
      console.log(`[${new Date().toLocaleString()}] Localtunnel terputus`);
      // Reconnect setelah beberapa detik
      setTimeout(createTunnel, 5000);
    });
}

// Memeriksa status localtunnel secara berkala
setInterval(checkTunnelStatus, 20000); // Memeriksa setiap 1 menit
