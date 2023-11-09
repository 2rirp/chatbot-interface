export function formatDateTime(dateTime: Date | string): any {
  const isItString = typeof dateTime === "string";
  let currentDateTime = "";
  let formattedCurrentString = "";

  if (!isItString) {
    let timeZoneOffset = dateTime.getTimezoneOffset();
    if (timeZoneOffset === 180) {
      return dateTime;
    }
  }

  const options = { timeZone: "America/Sao_Paulo" };

  if (isItString) {
    currentDateTime = new Date(
      new Date(dateTime).getTime() + 6 * 60 * 60 * 1000
    ).toLocaleString("pt-BR", options);
  } else {
    currentDateTime = dateTime.toLocaleString("pt-BR", options);
  }

  const [datePart, timePart] = currentDateTime.split(", ");
  const [day, month, year] = datePart.split("/");

  formattedCurrentString = `${year}-${month}-${day}T${timePart}.000Z`;

  return new Date(formattedCurrentString);
}
