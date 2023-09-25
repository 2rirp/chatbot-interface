interface PhoneNumberFormatterProps {
  phoneNumber: string;
  className?: string;
}

function PhoneNumberFormatter(props: PhoneNumberFormatterProps) {
  const formatNumber = (number: string) => {
    if (number.length === 12 || number.length === 13) {
      const userDDD = number.slice(2, 4);
      let firstPart = "";
      let lastPart = "";
      if (number.length === 12) {
        firstPart = number.slice(4, 8);
        lastPart = number.slice(8);
      } else {
        firstPart = number.slice(4, 9);
        lastPart = number.slice(9);
      }

      const formattedNumber = `(${userDDD}) ${firstPart}-${lastPart}`;
      return formattedNumber;
    } else {
      return number;
    }
  };

  const formattedNumber = formatNumber(props.phoneNumber);

  return <span className={`${props.className || ""}`}>{formattedNumber}</span>;
}

export default PhoneNumberFormatter;
