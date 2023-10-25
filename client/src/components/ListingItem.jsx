import React from "react";
import { Link } from "react-router-dom";
// import { FaLocationDot } from "react-icons/fa";
import { MdBathroom, MdBedroomParent, MdLocationOn } from "react-icons/md";

export default function ListingItem({ item }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${item._id}`} className="gap-3">
        <img
          src={item.imageUrls[0]}
          alt="listing_cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="gap-2">
          <div className="p-3">
            <p className="truncate text-lg font-semibold text-slate-700">
              {item.name}
            </p>
          </div>
          <div className="flex flex-row items-center justify-center gap-2 mb-4">
            <MdLocationOn className="text-green-600" />
            <p className="truncate text-sm text-blue-500">{item.address}</p>
          </div>
          <div>
            <p className="font-semibold text-sm m-4 line-clamp-2">
              {item.description}
            </p>
          </div>
          <div className="flex flex-row justify-center gap-5">
            <div className="flex flex-row item-center justify-center gap-2">
              {/* <MdBedroomParent className="text-green-400" /> */}
              <p className="font-semibold text-slate-500">
                {item.bedrooms} Beds
              </p>
            </div>
            <div className="flex flex-row  justify-center gap-2">
              {/* <MdBathroom className="text-green-400" /> */}
              <p></p>
              <p className="font-semibold text-slate-500">
                {item.bathrooms} Baths
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-5 mx-5 justify-end mb-5">
            {item.type === "sale" ? (
              <p className="p-1 bg-green-400 text-white rounded-lg w-max px-4 mt-2 ">
                ₹ {item.regularPrice}
              </p>
            ) : (
              <p className="p-1 bg-green-400 text-white rounded-lg w-max px-4 mt-2 ">
                ₹ {item.regularPrice} / Month
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
