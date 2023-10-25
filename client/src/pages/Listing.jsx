import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { useSelector } from "react-redux";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarker,
  FaMapMarkerAlt,
  FaParking,
} from "react-icons/fa";
import Contact from "../components/Contact";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState({});
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  console.log(currentUser._id, listing.userRef);

  useEffect(() => {
    console.log(currentUser);
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [listing.params]);

  return (
    <div>
      {loading && (
        <p className="uppercase text-2xl font-bold text-center">loading...</p>
      )}
      {error && (
        <p className="text-red-700 text-center my-7 text-2xl">
          Something went wrong
        </p>
      )}
      {listing && listing.imageUrls && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      <div className="m-5 gap-3">
        <p className="font-bold text-black text-4xl mt-5">
          {listing.name} - ({listing.regularPrice})
        </p>
        <div className="gap-2 flex items-center mt-3">
          <FaMapMarkerAlt className="text-green-600" />
          <p>{listing.address}</p>
        </div>
        <div className="flex flex-row gap-2 mt-2">
          <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md mt-3 uppercase">
            {listing.type === "rent" ? "for rent" : "for sale"}
          </p>
          <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md mt-3">
            ₹ {listing.regularPrice - listing.discountPrice} /-
          </p>
        </div>
        <p className="mt-4 text-slate-600">
          <span className="text-black font-semibold">Description - </span>
          {listing.description}
        </p>
        <div className="flex mb-4">
          <div className="w-3/4">
            <ul className="text-green-500 font-semibold text-lg flex flex-row gap-3 mt-3 justify-between">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} - beds`
                  : `${listing.bedrooms} - bed`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} - baths`
                  : `${listing.bathrooms} - bath`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking className="text-lg" />
                {listing.parking ? "Available" : "Not available"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap uppercase">
                <FaChair className="text-lg" />
                {listing.furnished ? "furnished" : "not furnished"}
              </li>
            </ul>
          </div>
        </div>
        {currentUser && listing.userRef !== currentUser._id && !contact && (
          <button
            onClick={() => setContact(true)}
            className="bg-slate-500 p-3 uppercase hover:opacity-80 rounded-lg text-white items-center w-full"
          >
            Contact Landload
          </button>
        )}
        {contact && <Contact listing={listing} />}
      </div>
    </div>
  );
}
