import React, { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { Modal, Spin } from "antd";
import "./PhotoList.css";

const PhotoList = ({ searchText }) => {
  // States to manage data and loading status
  const [photosArray, setPhotosArray] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Function to fetch image data with debouncing to avoid multiple requests
  const fetchImageData = debounce(() => {
    setIsDataLoading(true);

    // Get the API key from environment variables
    const apiKey = process.env.REACT_APP_API_KEY;

    // Determine the appropriate Flickr API method based on search text
    let photoMethod;
    if (searchText.trim() === "") {
      photoMethod = "getRecent";
    } else {
      photoMethod = "search";
    }

    // Retrieve search history from local storage
    const stringifiedHistory = localStorage.getItem("photoSearchHistory");
    const storedHistory = JSON.parse(stringifiedHistory);

    // Find the index of the current search text in the search history
    const index = storedHistory?.findIndex((element) => {
      return element.toLowerCase() === searchText.toLowerCase();
    });

    // Create the data object for the API request
    let data = {
      method: `flickr.photos.${photoMethod}`,
      api_key: apiKey,
      format: "json",
      nojsoncallback: 1,
      safe_search: "1", // Implement safe search
    };

    if (searchText.trim() !== "") {
      data = { ...data, tags: searchText };
    }

    // Create the URL for the API request
    const parameters = new URLSearchParams(data);
    const url = `https://api.flickr.com/services/rest/?${parameters}`;

    // Fetch and process the response
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        const photoCollectionObj = response.photos.photo;
        const photosCollectionArr = photoCollectionObj?.map((value) => {
          return `https://live.staticflickr.com/${value.server}/${value.id}_${value.secret}.jpg`;
        });

        // Update state with the fetched images
        setIsDataLoading(false);
        setPhotosArray(photosCollectionArr);

        // Update search history if necessary
        if (photoMethod === "search") {
          if (stringifiedHistory) {
            if (index === -1)
              localStorage.setItem(
                "photoSearchHistory",
                JSON.stringify([searchText, ...storedHistory])
              );
          } else {
            localStorage.setItem(
              "photoSearchHistory",
              JSON.stringify([searchText])
            );
          }
        }
      })
      .catch((error) => {
        // Handle errors and reset state
        setIsDataLoading(false);
        setPhotosArray([]);
        console.log(error);
      });
  }, 1000);

  // Trigger the fetch function when search text changes
  useEffect(() => {
    fetchImageData();

    // Cleanup the debounced function to prevent memory leaks
    return () => {
      fetchImageData.cancel();
    };
  }, [searchText.trim().toLowerCase()]);

  // Function to show the image modal
  const showModal = (img) => {
    setModalImage(img);
    setIsModalOpen(true);
  };

  // Function to close the image modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setModalImage("");
  };

  // Render component based on loading and image data
  return isDataLoading ? (
    <div>
      <Spin tip="Loading" size="large" className="Spinner">
        <div />
      </Spin>
    </div>
  ) : !isDataLoading && photosArray.length > 0 ? (
    <div className="PhotoListContainer">
      {photosArray?.map((photo, index) => (
        <div
          key={index}
          className="PhotoParent"
          onClick={() => showModal(photo)}
        >
          <img
            src={photo}
            alt="img"
            width={"220px"}
            height={"220px"}
            style={{ objectFit: "cover" }}
          />
        </div>
      ))}
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        centered
        footer={null}
        closable={false}
      >
        <div className="ModalImageParent">
          <img src={modalImage} alt="img" width={"100%"} />
        </div>
      </Modal>
    </div>
  ) : (
    <div className="imageNotFound">
      <h3 align="center">No images found</h3>
    </div>
  );
};

export default PhotoList;
