import React, { useState, useEffect } from "react";
import { HTTPRequest } from "../../utils/HTTPRequest";

export interface ConversationData {
  data: any;
  status: number;
}

function DatesSelect() {
  const [conversationDates, setConversationDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  async function fetchDatesSelect() {
    try {
      const response = await HTTPRequest<ConversationData>(
        "http://localhost:5000/conversations/dates",
        "GET"
      );
      const responseData = response.data;

      if (responseData) {
        const conversationDates = responseData.data;

        if (conversationDates && conversationDates.length > 0) {
          setConversationDates(conversationDates);
        } else {
          console.error("No conversation dates found:", conversationDates);
        }
      } else {
        console.error("Response data is undefined or null:", responseData);
      }
    } catch (error) {
      console.error("Error fetching conversation dates:", error);
    }
  }

  useEffect(() => {
    fetchDatesSelect();
  }, []);

  function handleDateChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedDate(event.target.value);
  }

  return (
    <div>
      <select id="dateSelect" value={selectedDate} onChange={handleDateChange}>
        <option value="">Selecione uma data</option>
        {conversationDates.length === 0 ? (
          <option disabled>Nenhuma data disponível</option>
        ) : (
          conversationDates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))
        )}
      </select>
    </div>
  );
}

export default DatesSelect;
