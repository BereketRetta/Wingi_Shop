import React, { useEffect, useState } from "react";
import { Navbar } from "../components";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { auth, db, getCollections, storage } from "..";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import EditProducts from "../components/EditProducts";

const Dashboard = () => {
  const [link, setLink] = useState(0);

  const navigate = useNavigate();
  // Create Mode
  const [Name, setName] = useState(null);
  const [Category, setCategory] = useState(null);
  const [Price, setPrice] = useState(null);
  const [File, setFile] = useState(null);
  const [Description, setDescription] = useState(null);

  let componentMounted = true;

  let fileInput = React.createRef();

  const AllProducts = useSelector((state) => state.handleAddItems.AllItems);
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      if (componentMounted) {
        getCollections(db).then((data) => {
          setFilter(
            data.filter((item) => item.owner_id === auth.currentUser.uid)
          );
        });
      }

      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        componentMounted = false;
      };
    };

    getProducts();
  }, []);

  const onAddButtonClick = async (e) => {
    e.preventDefault();
    if (!File) {
      alert("Please choose a photo first!");
    }
    const storageRef = await ref(
      storage,
      `/${Math.random().toString(36).substring(7)}}`
    );

    await uploadBytesResumable(storageRef, File).then(async (value) => {
      console.log(value);
      await getDownloadURL(value.ref).then(async (url) => {
        const collectionRef = collection(db, "collection");
        const payload = {
          category: Category,
          description: Description,
          photos: [url],
          name: Name,
          owner_id: auth.currentUser.uid,
          price: Price,
        };

        await addDoc(collectionRef, payload).then((doc) => {
          setDoc(doc, {
            id: doc.id,
            category: Category,
            description: Description,
            photos: [url],
            name: Name,
            owner_id: auth.currentUser.uid,
            price: Price,
            availability: "yes",
          });
          console.log("Document written with ID: ", doc.id);
        });

        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 500);
      });
    });
  };

  const onSaveClick = async (values) => {
    if (typeof values.photos[0] === "string") {
      await updateDoc(doc(db, "collection", values.id), {
        ...values,
      });
    } else {
      const storageRef = await ref(
        storage,
        `/${Math.random().toString(36).substring(7)}}`
      );
      await uploadBytesResumable(storageRef, values.photos[0]).then((value) => {
        console.log(value);
        getDownloadURL(value.ref).then(async (url) => {
          await updateDoc(doc(db, "collection", values.id), {
            ...values,
            owner_id: auth.currentUser.uid,
            photos: [url],
          });
        });
      });
    }
  };

  const onDeleteClick = async (product) => {
    const docRef = doc(db, "collection", product.id);

    await deleteDoc(docRef)
      .then(() => {
        console.log("Entire Document has been deleted successfully.");
      })
      .catch((error) => {
        console.log(error);
      });

    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <Navbar />
      <div class="row my-4 h-100">
        <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
          <NavLink className="navbar-brand fw-bold fs-4 px-2">
            Welcome To The dashboard
          </NavLink>

          <div style={{ alignSelf: "center", marginTop: 30 }}>
            <NavLink
              onClick={() => setLink(1)}
              className="btn btn-outline-dark m-2"
            >
              Add A Product
            </NavLink>
            <NavLink
              onClick={() => setLink(2)}
              className="btn btn-outline-dark m-2"
            >
              Edit A Product
            </NavLink>
          </div>

          {link === 1 && (
            <form>
              <h4 style={{ marginTop: 20, marginBottom: 10 }}>
                Enter product Information
              </h4>
              <div class="form my-3">
                <label for="Name">Name</label>
                <input
                  value={Name}
                  onChange={(e) => setName(e.target.value)}
                  class="form-control"
                  id="Name"
                  placeholder="Enter the name of the product"
                />
              </div>
              <div class="form my-3">
                <label for="Name">Category</label>
                <input
                  value={Category}
                  onChange={(e) => setCategory(e.target.value)}
                  class="form-control"
                  id="Name"
                  placeholder="Enter the category of the category"
                />
              </div>
              <div class="form my-3">
                <label for="Email">Price</label>
                <input
                  value={Price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  class="form-control"
                  id="Email"
                  placeholder="Enter the price of the product"
                />
              </div>
              <div class="form my-3">
                <label for="Email">Photos</label>
                <input
                  ref={fileInput}
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                  type="file"
                  class="form-control"
                  id="file"
                  placeholder="Add any available photos"
                />
              </div>
              <div class="form  my-3">
                <label for="Password">Description</label>
                <textarea
                  value={Description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  class="form-control"
                  placeholder="Enter the description of the product"
                />
              </div>
              <div className="text-center">
                <button
                  onClick={onAddButtonClick}
                  class="my-2 px-4 mx-auto btn btn-dark"
                  type="submit"
                >
                  Add
                </button>
              </div>
            </form>
          )}
          {link === 2 && (
            <div
              style={{
                width: "830px",
                display: "grid",
              }}
            >
              {filter.length === 0 ? (
                <div className="col-md-12 py-5 bg-light text-center">
                  <h4 className="p-3 display-5">No Products To Edit Please add a product first</h4>
                </div>
              ) : (
                filter.map((product) => (
                  <EditProducts
                    product={product}
                    onSaveClick={onSaveClick}
                    onDeleteClick={onDeleteClick}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
