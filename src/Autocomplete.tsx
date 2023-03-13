import React, { useState, useRef, KeyboardEvent } from "react";
import { BrandGithub, Users } from "tabler-icons-react";
// import "./Autocomplete.css";
type AutocompleteProps = {
  placeholder: string;
};

type IResultItem = {
  userName: string;
  repoName: string;
  url: string;
  type: string;
};
interface ICardDisplayProps {
  item: IResultItem;
  selectedIndex: number;
  index: number;
}

const CardDisplay = ({
  item: { url, type, userName, repoName },
  selectedIndex,
  index,
}: ICardDisplayProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.5rem",
        padding: "1rem",
        borderRadius: "5px",
        cursor: "pointer",

        backgroundColor: index === selectedIndex ? "#91A7FF" : "#74C0FC",
      }}
      onClick={() => window.open(url, "_blank")}
    >
      {type === "user" ? (
        <Users size={20} strokeWidth={1.5} color="white" />
      ) : (
        <BrandGithub size={20} strokeWidth={1.5} color="white" />
      )}
      <div
        key={url}
        style={{
          width: "fit-content",
          height: "100%",
          wordBreak: "break-all",
          fontFamily: "DM Mono, monospace",
          fontWeight: "bold",
        }}
      >
        {repoName}
      </div>
      <div
        key={url}
        style={{
          width: "100px",
          height: "100%",
          wordBreak: "break-all",
          fontFamily: "DM Mono, monospace",
          fontWeight: "300",
          color: "#25262B",
        }}
      >
        {userName}
      </div>
    </div>
  );
};

const Autocomplete: React.FC<AutocompleteProps> = ({ placeholder }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<IResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const timeoutRef = useRef(-1);

  const handleChange = (val: string) => {
    window.clearTimeout(timeoutRef.current);
    setSearchTerm(val);
    timeoutRef.current = window.setTimeout(async () => {
      if (searchTerm.length >= 3) {
        setIsLoading(true);

        try {
          const response = await fetch(`http://localhost:8083/${val}`);
          const data = await response.json();
          setSelectedIndex(0);
          setResults(data);
        } catch (error) {
          console.error(error);
        }
        setIsLoading(false);
      } else {
        setResults([]);
      }
    }, 200);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowRight" && selectedIndex < results.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    } else if (event.key === "ArrowLeft" && selectedIndex > -1) {
      setSelectedIndex(selectedIndex - 1);
    } else if (event.key === "Enter" && selectedIndex > -1) {
      window.open(results[selectedIndex].url, "_blank");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
        padding: "2rem",
      }}
    >
      <input
        style={{
          width: "500px",
          padding: "1rem",
          borderRadius: "5px",
          border: "1px solid #74C0FC",
        }}
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {isLoading && (
        <div
          style={{
            fontFamily: "DM Mono, monospace",
          }}
        >
          Loading...
        </div>
      )}
      {!isLoading && results.length === 0 && (
        <div
          style={{
            fontFamily: "DM Mono, monospace",
          }}
        >
          No results found
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "1rem",
          padding: "2rem",
        }}
      >
        {!isLoading &&
          results.length > 0 &&
          results.map((result, index) => (
            <CardDisplay
              item={result}
              selectedIndex={selectedIndex}
              index={index}
            />
          ))}
      </div>
    </div>
  );
};

export default Autocomplete;
