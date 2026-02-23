import { useEffect, useState } from 'react'
import axios from "./API/axios.js";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("jakarta");
  const [riwayat, setRiwayat] = useState([])
  const [color, setColor] = useState([])

  const API_KEY = import.meta.env.VITE_WEATHER_KEY;
  //const url = `/weather?q=${location}&units=metric&appid=${API_KEY}`;

  const fetchWeather = async (city) => {
    try {
      const response = await axios.get(
        `/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      setData(response.data);

      setRiwayat((prev)=>{
        const updatedRiwayat = [city, ...prev.filter((c) => c !== city)]
        localStorage.setItem("riwayat", JSON.stringify(updatedRiwayat))
        return(updatedRiwayat)
      })
    } catch {
      alert("Kota tidak ditemukan!");
    }
  };

  const Time = (timestamp) => {
    const tgl = new Date(timestamp * 1000)
    return tgl.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})
  }

  // Fetch default Jakarta saat pertama load
  useEffect(() => {
    const riwayatKota = JSON.parse(localStorage.getItem("riwayat")) || []
    setRiwayat(riwayatKota)
    fetchWeather("Jakarta");
  }, []);

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      fetchWeather(location);
      setLocation("");
    }
  };

  return (
    <div className="min-h-screen bg-blue-200 text-white flex flex-col items-center pt-20">
      {/* Search Section */}
      <div className="text-center p-4">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Input city name"
          className="p-4 w-auto text-center rounded-full bg-black/10 border border-white/20 outline-none focus:border-blue-400 transition-all"
        />
      </div>

      {/* Weather Display Section */}
      {data.name && (
        <div className="mt-10 bg-blue-300 p-10 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl text-center">
          <h1 className="text-3xl font-light tracking-widest">{data.name}</h1>
          <div className="mt-6">
            <h2 className="text-8xl font-bold">{data.main?.temp.toFixed()}°C</h2>
          </div>
          <div className="mt-4">
            <p className="text-xl text-blue-300 font-medium uppercase tracking-widest">
              {data.weather ? data.weather[0].main : null}
            </p>
          </div>
          
          {/* Detail Info */}
          <div className="flex justify-between gap-10 mt-4 p-4 border-t border-white/50">
            <div>
              <p className="text-gray-200 text-sm">Kelembapan</p>
              <p className="font-bold">{data.main?.humidity}%</p>
            </div>
            <div>
              <p className="text-gray-200 text-sm">Angin</p>
              <p className="font-bold">{data.wind?.speed} MPH</p>
            </div>
            {/* matahari */}
            <div className='flex justify-between gap-10'>
              <div>
                <p className="text-gray-200 text-sm">Sunrise</p>
                <p className="font-bold">{Time(data.sys?.sunrise)}</p>
              </div>
              <div>
                <p className="text-gray-200 text-sm">Sunset</p>
                <p className="font-bold">{Time(data.sys?.sunset)}</p>
              </div>
            </div>
          </div>
          
          {/* Negara */}
          <div className="text-white text-sm">
            <p>Country: {data.sys?.country}</p>
          </div>
        </div>
      )}
      
      {/* Riwayat Kota */}
      <div className='rounded-3xl bg-blue-300 border border-white/10 backdrop-blur-md shadow-2xl text-center m-5'>
        {riwayat.length > 0 && (
          riwayat.map((city, index) => (
            <button className='m-5' key={index} onClick={()=> fetchWeather(city)}>
              {city}
            </button>
          ))
        )}
      </div>

    </div>
  );
}

export default App;

