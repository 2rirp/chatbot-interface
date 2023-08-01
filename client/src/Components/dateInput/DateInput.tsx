import React, { useState } from "react";

interface DateInputProps {
  handleDateChange: (date: string) => void;
}

function DateInput(props: DateInputProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const date = event.target.value;
    setSelectedDate(date);
    props.handleDateChange(date);
  }

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
