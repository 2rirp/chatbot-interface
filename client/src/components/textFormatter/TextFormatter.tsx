import "./textFormatter.css";

interface TextFormatterProps {
  text: string;
}

function TextFormatter({ text }: TextFormatterProps) {
  const boldRegex = /\*([^\s*].*?[^\s*])\*/g;
  const italicRegex = /\_([^\s_].*?[^\s_])\_/g;
  const strikeRegex = /\~([^\s~].*?[^\s~])\~/g;
  const monospaceRegex = /\```([^```].*?[^```])\```/gs;

  const formattingRegex = /(\*[^*]+\*|_[^_]+_|~[^~]+~|```[^```]+```)/g;

  const formatText = (text: string) => {
    let formattedText = text.split(formattingRegex);

    console.log(text);
    console.log(formattedText);
    return formattedText;
  };

  const formattedText = formatText(text);

  return (
    <div className="copyable-text">
      {formattedText.map((segment, index) => {
        if (boldRegex.test(segment)) {
          return (
            <span key={index} className="bold">
              {segment.replace(boldRegex, "$1")}
            </span>
          );
        } else if (italicRegex.test(segment)) {
          return (
            <span key={index} className="italic">
              {segment.replace(italicRegex, "$1")}
            </span>
          );
        } else if (strikeRegex.test(segment)) {
          return (
            <span key={index} className="strike">
              {segment.replace(strikeRegex, "$1")}
            </span>
          );
        } else if (monospaceRegex.test(segment)) {
          return (
            <span key={index} className="monospace">
              {segment.replace(monospaceRegex, "$1")}
            </span>
          );
        } else {
          return segment;
        }
      })}
    </div>
  );
}

export default TextFormatter;
