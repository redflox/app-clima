import { LoadingButton } from "@mui/lab";
import { Box, Container, TextField, Typography } from "@mui/material";
import { FormEvent, useState } from "react";

const API_WEATHER = `https://api.weatherapi.com/v1/current.json?key=${
  import.meta.env.VITE_API_KEY
}&q=`;

function App() {
  // EL estado que maneja el texto de entrada
  const [textCity, setTextCity] = useState("");

  // el estado que indica cuando se esta cargando
  const [loading, setLoading] = useState(false);

  //el estado que maneja los errores
  const [error, setError] = useState({
    error: false,
    message: "",
  });

  //el estado de la respuesta del api
  const [responseApi, setResponseApi] = useState({
    city: "",
    country: "",
    temp: "",
    condition: "",
    icon: "",
    conditionText: "",
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError({
      error: false,
      message: "",
    });
    try {
      if (!textCity.trim()) {
        throw { message: "El campo ciudad es obligatorio" };
      }
      const url = `${API_WEATHER}${textCity}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data)
      if (data.error) throw { message: data.error.message };

      setResponseApi({
        city: data.location.name,
        country: data.location.country,
        temp: data.current.temp_c,
        condition: data.current.condition.code,
        icon: data.current.condition.icon,
        conditionText: data.current.condition.text,
      });
      console.log(responseApi);
    } catch (error) {
      setLoading(false);
      setError({
        error: true,
        message: error.message,
      });
    } finally {
      setLoading(false);
      console.log("siempre se ejecuta despues de lo que hay en el try");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 2 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        App Clima
      </Typography>
      <Box
        sx={{ display: "grid", gap: 2 }}
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextField
          id="city"
          label="Ciudad"
          variant="outlined"
          size="small"
          required
          fullWidth
          value={textCity}
          onChange={(e) => setTextCity(e.target.value)}
          error={error.error}
          helperText={error.message}
        />
        <LoadingButton
          type="submit"
          variant="contained"
          loading={loading}
          loadingIndicator="Cargando..."
        >
          Buscar
        </LoadingButton>
      </Box>

      {responseApi.city && (
        <Box
          sx={{
            mt: 2,
            display: "grid",
            gap: 2,
            textAlign: "center"
          }}
        >
         <Typography variant="h4" component="h2">
          {responseApi.city}, {responseApi.country}
         </Typography>
         <Box
          component="img"
          alt={responseApi.conditionText}
          src={responseApi.icon}
          sx={{ margin: "0 auto"}}
         />
         <Typography variant="h5" component="h3">
          {responseApi.temp} °C. 
         </Typography>
         <Typography variant="h6" component="h4">
          {responseApi.conditionText} 
         </Typography>
        </Box>
      )}

      <Typography textAlign="center" sx={{ mt: 2, fontSize: "10px" }}>
        Powered by:{" "}
        <a href="https://www.weatherapi.com/" title="whether API">
          weather.com
        </a>
      </Typography>
    </Container>
  );
}

export default App;
