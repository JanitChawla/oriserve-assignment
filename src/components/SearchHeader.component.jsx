import React, { useState, useEffect } from "react";
import "./SearchHeader.css";
import { AutoComplete, Button } from "antd";

const SearchHeader = ({ setSearchText, searchText }) => {
  const storedHistory = JSON.parse(
    localStorage.getItem("photoSearchHistory")
  )?.map((value) => ({
    value: value,
  }));

  const [options, setOptions] = useState(storedHistory ?? []);
  const [showClearButton, setShowClearButton] = useState(false);

  useEffect(() => {
    setShowClearButton(!!storedHistory);
  }, [storedHistory]);

  const onSearch = (text) => {
    const searchedHistory = JSON.parse(
      localStorage.getItem("photoSearchHistory")
    )?.map((value) => ({
      value: value,
    }));

    setOptions(
      searchedHistory?.filter((value) => {
        return value?.value?.toLowerCase()?.includes(text.toLowerCase());
      })
    );
  };

  const clearSearchHistory = () => {
    localStorage.removeItem("photoSearchHistory");
    setOptions([]);
    setShowClearButton(false);
  };

  return (
    <div className="Header">
      <p className="Title">Search Photos</p>
      <AutoComplete
        value={searchText}
        options={options}
        className="AutoComplete"
        onSearch={(text) => onSearch(text)}
        onChange={(text) => {
          setSearchText(text);
        }}
        placeholder="Search here..."
        dropdownRender={(menu) => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row-reverse",
            }}
          >
            {showClearButton && (
              <Button type="primary" danger onClick={clearSearchHistory}>
                Clear History
              </Button>
            )}
            {menu}
          </div>
        )}
      />
    </div>
  );
};

export default SearchHeader;
