import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  ref,
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  userDeleteAccountStart,
  userDeleteAccountError,
  userDeleteAccountSuccess,
  signOutAccountStart,
  signOutAccountError,
  signOutAccountSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";
import Listing from "../../../api/models/listing.model";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [files, setFiles] = useState(undefined);
  const [filePer, setFilePer] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showListingError, setShowListingError] = useState(false);

  console.log(currentUser);

  const dispatch = useDispatch();

  useEffect(() => {
    if (files) {
      handleFileUpload(files);
    }
  }, [files]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePer(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(userDeleteAccountStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(userDeleteAccountError(data.message));
      }
      dispatch(userDeleteAccountSuccess(data));
    } catch (error) {
      dispatch(userDeleteAccountError(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(signOutAccountStart());
      const res = await fetch("/api/auth/signOut");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutAccountError(data.message));
        return;
      }
      dispatch(signOutAccountSuccess(data));
    } catch (error) {
      dispatch(signOutAccountError(data.message));
    }
  };

  const handleGetUserListing = async () => {
    try {
      const res = await fetch(`/api/user/listing/${currentUser._id}`);

      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {}
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-4">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFiles(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          className="rounded-full h-24 w-24 object-cover self-center cursor-pointer"
          alt="Profile"
        />
        <p className="text-center">
          {fileUploadError ? (
            <span className="text-red-700">Error Image upload</span>
          ) : filePer > 0 && filePer < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePer}%`}</span>
          ) : filePer === 100 ? (
            <span className="text-green-700">Successfully Uploaded</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          id="username"
          className="border p-3 rounded-lg"
          placeholder="Username"
          onChange={handleChange}
          defaultValue={currentUser.username}
        />
        <input
          type="email"
          id="email"
          className="border p-3 rounded-lg"
          placeholder="Email"
          onChange={handleChange}
          defaultValue={currentUser.email}
        />
        <input
          type="password"
          id="password"
          className="border p-3 rounded-lg"
          placeholder="Password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="uppercase bg-slate-700 text-white rounded-lg p-3 hover:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-center p-3 text-white uppercase rounded-lg hover:opacity-80"
          to={"/create-listing"}
        >
          create listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer font-semibold"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-700 cursor-pointer font-semibold"
        >
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5 font-semibold">{error ? error : ""}</p>
      <p className="text-green-700 mt-5 font-semibold">
        {updateSuccess ? "User Updated Successfully..!" : ""}
      </p>
      <button
        onClick={handleGetUserListing}
        className="text-green-700 uppercase w-full mb-3"
      >
        show listing
      </button>
      <p>{showListingError ? "Error Show listing" : ""}</p>
      {userListings &&
        userListings.length > 0 &&
        userListings.map((listing) => (
          <div
            key={listing._id}
            className="border p-3 justify-between rounded-lg items-center flex mt-2 gap-2"
          >
            <Link to={`/listing/${listing._id}`}>
              <img className="w-16 h-16" src={listing.imageUrls[0]} />
            </Link>
            <Link className="flex-1" to={`/listing/${listing._id}`}>
              <p className="hover:underline font-semibold text-slate-700">
                {listing.name}
              </p>
            </Link>
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => handleDeleteListing(listing._id)}
                className="rounded-lg uppercase text-red-700 font-semibold hover:opacity-70"
              >
                delete
              </button>
              <Link to={`/update-listing/${listing._id}`}>
                <button className="rounded-lg uppercase text-green-700 font-semibold hover:opacity-70">
                  edit
                </button>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
}
