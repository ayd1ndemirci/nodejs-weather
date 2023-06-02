const axios = require("axios");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

async function isValidCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},tr&lang=tr&appid=aee9368ab4b3e538bec75d39005eccf3`;
    try {
        const response = await axios.get(url);
        const weatherData = response.data;
        return weatherData.sys.country === "TR";
    } catch (error) {
        return false;
    }
}

async function getWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},tr&lang=tr&appid=aee9368ab4b3e538bec75d39005eccf3`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error("Hava durumu bilgileri alınamadı.");
    }
}

function printWeatherData(weatherData) {
    console.log("Şehir: " + weatherData.name);
    console.log("Sıcaklık: " + Math.round(weatherData.main.temp - 273.15).toFixed(1) + " °C");
    console.log("Hava Durumu: " + capitalizeFirstLetter(weatherData.weather[0].description));
}

async function weather() {
    rl.question("Şehir Giriniz: ", async (city) => {
        const isValid = await isValidCity(city);
        if (!isValid) {
            console.log("Sadece Türkiye'deki şehirleri girebilirsiniz!");
            rl.close();
            return;
        }

        try {
            const weatherData = await getWeatherData(city);
            printWeatherData(weatherData);
        } catch (error) {
            console.log("Bilgiler alınırken hata oluştu:", error.message);
        }

        rl.close();
    });
}

weather();
