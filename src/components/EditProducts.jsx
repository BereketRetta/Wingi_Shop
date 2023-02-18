import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function EditProducts({ product, onSaveClick, onDeleteClick }) {
  // Edit Mode
  const [Edit, setEdit] = useState(false);
  const [NameE, setNameE] = useState(null);
  const [PriceE, setPriceE] = useState(null);
  const [FileE, setFileE] = useState(null);
  const [DescriptionE, setDescriptionE] = useState(null);

  const [selectedOption, setSelectedOption] = useState("");

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const onSaveEdited = () => {
    setEdit(false);
    const values = {
      ...product,
      name: NameE,
      description: DescriptionE,
      price: PriceE,
      availability: selectedOption,
      photos: [FileE],
    };
    onSaveClick(values);
  };

  const changeToSave = (product) => {
    setNameE(product.name);
    setPriceE(product.price);
    setSelectedOption(product.availability);
    setFileE(product.photos[0]);
    setDescriptionE(product.description);
    setEdit(true);
  };
  return (
    <div
      id={product.id}
      key={product.id}
      style={{ width: "400px" }}
      className="mb-4"
    >
      <div className="card text-center h-100" key={product.id}>
        {!Edit ? (
          <img
            className="card-img-top p-3"
            src={product.photos[0]}
            alt="Card"
            height={300}
          />
        ) : (
          <>
            <img
              className="card-img-top p-3"
              src={product.photos[0]}
              alt="Card"
              height={300}
            />
            <input
              onChange={(e) => {
                setFileE(e.target.files[0]);
              }}
              type="file"
              class="form-control"
              id="file"
              placeholder="Add any available photos"
            />
          </>
        )}
        <div className="card-body">
          {Edit ? (
            <input
              value={NameE}
              onChange={(e) => setNameE(e.target.value)}
              class="form-control"
              id="Name"
              placeholder="Enter the name of the product"
            />
          ) : (
            <h5 className="card-title">{product.name}...</h5>
          )}
          {Edit ? (
            <textarea
              value={DescriptionE}
              onChange={(e) => setDescriptionE(e.target.value)}
              rows={5}
              class="form-control"
              placeholder="Enter the description of the product"
            />
          ) : (
            <p className="card-text">
              {product.description.substring(0, 90)}...
            </p>
          )}
        </div>
        <ul className="list-group list-group-flush">
          {Edit ? (
            <input
              value={PriceE}
              onChange={(e) => setPriceE(e.target.value)}
              type="number"
              class="form-control"
              id="Email"
              placeholder="Enter the price of the product"
            />
          ) : (
            <li className="list-group-item lead">$ {product.price}</li>
          )}
        </ul>
        {Edit && (
          <div>
            <div>
              <label htmlFor="category" style={{ marginRight: 10 }}>
                Category
              </label>
              <select value={selectedOption} onChange={handleSelectChange}>
                <option value="">Is this item still available?</option>
                <option value="yes">yes</option>
                <option value="no">no</option>
              </select>
            </div>
          </div>
        )}
        <div className="card-body">
          <Link
            onClick={() => (Edit ? onSaveEdited() : changeToSave(product))}
            className="btn btn-dark m-1"
          >
            {Edit ? "Save" : "Edit"}
          </Link>
          <div
            onClick={(e) => {
              e.preventDefault();
              onDeleteClick(product);
            }}
            className="btn btn-red m-1 cursor-pointer"
          >
            Delete
          </div>
        </div>
      </div>
    </div>
  );
}
