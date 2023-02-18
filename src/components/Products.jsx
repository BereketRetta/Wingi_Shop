import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAllItems } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Link } from "react-router-dom";
import { db, getCollections } from "..";

const Products = () => {
  const [loading, setLoading] = useState(false);
  let componentMounted = true;

  const dispatch = useDispatch();

  // const AllProducts = useSelector((state) => state.handleAddItems.AllItems);
  const [filter, setFilter] = useState([]);
  const [Data, setData] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);

      if (componentMounted) {
        getCollections(db).then((data) => {
          // dispatch(addAllItems(data));
          setFilter(data);
          setData(data);
        });
        setLoading(false);
      }

      return () => {
        componentMounted = false;
      };
    };

    getProducts();
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = filter.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  const SearchName = (search) => {
    console.log(search);
    if (search) {
      const updatedList = Data.filter((item) =>
        item.name.toUpperCase().includes(search.toUpperCase())
      );
      setFilter(updatedList);
    } else {
      setFilter(Data);
    }
  };
  console.log(filter);
  let search
  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => setFilter(Data)}
          >
            All
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => {
              setFilter(Data);
              filterProduct("clothing");
            }}
          >
            Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => {
              setFilter(Data);
              filterProduct("Electronics");
            }}
          >
            Electronics
          </button>
        </div>
        <div className="buttons text-center py-5 w-100">
          <input
            value={search}
            onChange={(e) => search = e.target.value}
            class="form-control"
            id="Name"
            placeholder="Enter the name of the product"
          />
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => SearchName(search)}
          >
            Search
          </button>
        </div>

        {filter.filter((item) => item.availability === "yes").map((product) => {
          return (
            <div
              id={product.id}
              key={product.id}
              className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
            >
              <div className="card text-center h-100" key={product.id}>
                <img
                  className="card-img-top p-3"
                  src={product.photos[0]}
                  alt="Card"
                  height={300}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}...</h5>
                  <p className="card-text">
                    {product.description.substring(0, 90)}...
                  </p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item lead">$ {product.price}</li>
                </ul>
                <div className="card-body">
                  <Link className="btn btn-dark m-1">Buy Now</Link>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };
  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Products</h2>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
