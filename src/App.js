import { useState } from "react";
import "./App.css";
import PhotoList from "./components/PhotoList.component";
import SearchHeader from "./components/SearchHeader.component";

function App() {
  const [searchText, setSearchText] = useState("");

  return (
    <div>
      <SearchHeader setSearchText={setSearchText} searchText={searchText} />
      <PhotoList searchText={searchText} />
    </div>
  );
}

export default App;
