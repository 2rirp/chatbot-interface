import React, { useEffect, useState } from "react";
import "./dateInput.css";

interface DateInputProps {
  handleDateChange: (date: string) => void;
}

function DateInput(props: DateInputProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const date = event.target.value;
    setSelectedDate(date);
  }

  useEffect(() => {
    const options = { timeZone: "America/Sao_Paulo" };
    const [day, month, year] = new Date()
      .toLocaleString("pt-BR", options)
      .split(",")[0]
      .split("/");

    setSelectedDate(`${year}-${month}-${day}`);
  }, []);

  useEffect(() => {
    props.handleDateChange(selectedDate);
  }, [selectedDate]);

  return (
    <div>
      <input
        type="date"
        id="dateSelect"
        value={selectedDate}
        onChange={handleChange}
      />
    </div>
  );
}

export default DateInput;
