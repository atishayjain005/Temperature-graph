export default function handler(request, response) {
  const data = [];
  const minTemp = 15;
  const maxTemp = 45;
  
  for (let i = 0; i < 10; i++) {
    let pastDate = new Date().setDate(new Date().getDate() - (10 - i));
    const temp = Math.floor(Math.random() * (+maxTemp - +minTemp) + +minTemp);
    data.push({ date: pastDate, temperature: temp });
  }
  response.status(200).json({
    data
  });
}
