import React, { useEffect, useState } from "react";
import { Navbar, Product } from "../components";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Products from "../components/Products";
import { useDispatch, useSelector } from "react-redux";
import { db, getCollections, storage } from "..";
import { addAllItems } from "../redux/action";
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

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // Create Mode
  const [Name, setName] = useState(null);
  const [Category, setCategory] = useState(null);
  const [Price, setPrice] = useState(null);
  const [File, setFile] = useState(null);
  const [Description, setDescription] = useState(null);

  const [DownloadUrl, setDownloadUrl] = useState(null);
  const [DownloadUrlE, setDownloadUrlE] = useState(null);

  let componentMounted = true;

  const dispatch = useDispatch();

  let fileInput = React.createRef();

  const AllProducts = useSelector((state) => state.handleAddItems.AllItems);
  const [filter, setFilter] = useState(AllProducts);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);

      if (componentMounted) {
        getCollections(db).then((data) => {
          // dispatch(addAllItems(data));
          setFilter(data);
        });
        setLoading(false);
      }

      return () => {
        componentMounted = false;
      };
    };

    getProducts();
  }, []);

  const onAddButtonClick = async (e) => {
    e.preventDefault();
    const link = "";
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
        setDownloadUrl(url);
        console.log("URL::", DownloadUrlE);
        const collectionRef = collection(db, "collection");
        const payload = {
          category: Category,
          description: Description,
          photos: [url],
          name: Name,
          price: Price,
        };

        console.log("Payload::", payload);

        await addDoc(collectionRef, payload).then((doc) => {
          setDoc(doc, {
            id: doc.id,
            category: Category,
            description: Description,
            photos: [url],
            name: Name,
            price: Price,
            availability: 'yes'
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
          setDownloadUrlE(url);
          await updateDoc(doc(db, "collection", values.id), {
            ...values,
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
              {filter.map((product) => (
                <EditProducts
                  product={product}
                  onSaveClick={onSaveClick}
                  onDeleteClick={onDeleteClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
