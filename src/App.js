import React, { useState } from 'react';
import './App.css';
import Slider from './Slider'
import SidebarItem from './SidebarItem'
import {Form, Button, Container} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop from "react-image-crop";


const DEFAULT_OPTIONS = [
  {
    name: 'Brightness',
    property: 'brightness',
    value: 100,
    range: {
      min: 0,
      max: 200
    },
    unit: '%'
  },
  {
    name: 'Contrast',
    property: 'contrast',
    value: 100,
    range: {
      min: 0,
      max: 200
    },
    unit: '%'
  },
  {
    name: 'Saturation',
    property: 'saturate',
    value: 100,
    range: {
      min: 0,
      max: 200
    },
    unit: '%'
  },
  {
    name: 'Grayscale',
    property: 'grayscale',
    value: 0,
    range: {
      min: 0,
      max: 100
    },
    unit: '%'
  },
  {
    name: 'Sepia',
    property: 'sepia',
    value: 0,
    range: {
      min: 0,
      max: 100
    },
    unit: '%'
  },
  {
    name: 'Hue Rotate',
    property: 'hue-rotate',
    value: 0,
    range: {
      min: 0,
      max: 360
    },
    unit: 'deg'
  },
  {
    name: 'Blur',
    property: 'blur',
    value: 0,
    range: {
      min: 0,
      max: 20
    },
    unit: 'px'
  }
]

function App() {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0)
  const [options, setOptions] = useState(DEFAULT_OPTIONS)
  const selectedOption = options[selectedOptionIndex]

  // Image crop
  const [srcImg, setSrcImg] = useState(null);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({aspect: 16 / 9});
  const [result, setResult] = useState(null);

  const handleImage = async (event) => {
    const [file] = event.target.files;
    setSrcImg(URL.createObjectURL(file));
    // setSrcImg(URL.createObjectURL(event.target.files[0]));
    // console.log(event.target.files[0]);
    console.log(file);
};

const getCroppedImg = async () => {
    try {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        const base64Image = canvas.toDataURL("image/jpeg", 1);
        setResult(base64Image);
        console.log(result);
    } catch (e) {
        console.log("crop the image");
    }
};

const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(result);
}

  // Image Editor 
  function handleSliderChange({ target }) {
    setOptions(prevOptions => {
      return prevOptions.map((option, index) => {
        if (index !== selectedOptionIndex) return option
        return { ...option, value: target.value }
      })
    })
  }

  function getImageStyle() {
    const filters = options.map(option => {
      return `${option.property}(${option.value}${option.unit})`
    })

    return { filter: filters.join(' ') }
  }

  console.log(getImageStyle())

  return (
    <div className="container">
      <div>
        <h5 className="header">React Image Crop</h5>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Select Image you want to crop</Form.Label>
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                        />
                    </div>
                    <div>
                        {srcImg && (
                            <div>
                                <ReactCrop
                                    style={{maxWidth: "50%"}}
                                    src={srcImg}
                                    onImageLoaded={setImage}
                                    crop={crop}
                                    onChange={setCrop}
                                />
                                <Button className="cropButton" onClick={getCroppedImg}
                                >
                                    crop
                                </Button>
                            </div>
                        )}
                        {result && (
                            <div>
                                <img src={result} alt="cropped image"/>
                            </div>
                        )}
                    </div>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
      </div>
      <div className="main-image" style={getImageStyle()} />
      <div className="sidebar">
        {options.map((option, index) => {
          return (
            <SidebarItem
              key={index}
              name={option.name}
              active={index === selectedOptionIndex}
              handleClick={() => setSelectedOptionIndex(index)}
            />
          )
        })}
      </div>
      <Slider
        min={selectedOption.range.min}
        max={selectedOption.range.max}
        value={selectedOption.value}
        handleChange={handleSliderChange}
      />
    </div>
  )
}


export default App;
