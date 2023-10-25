import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import ListingItem from "../components/ListingItem";

SwiperCore.use([Navigation]);

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);

  const navigate = useNavigate();

  console.log(saleListings);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);

        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch("api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 fond-bold font-semibold text-3xl lg:text-6xl">
          Unlock the Door to Your
          <span className="text-slate-400 "> Future</span>
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm font-semibold">
          True Properties is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from
        </div>
        <Link
          to={"/search"}
          className="text-blue-600 hover:underline font-bold"
        >
          Let's get started...
        </Link>
      </div>
      {/* Swiper */}
      <div>
        <Swiper navigation>
          {offerListings &&
            offerListings.length > 0 &&
            offerListings.map((listing) => (
              <SwiperSlide>
                <div
                  style={{
                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                  className="h-[500px]"
                  key={listing._id}
                ></div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
      <div className="max-w-full mx-12 p-5 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div>
            <div>
              <h2 className="font-semibold text-4xl text-slate-500 my-3 p-2">
                Recent Offers
              </h2>
              <Link
                to={"/search?offer=true"}
                className="text-blue-600 hover:underline p-2"
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem item={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div>
              <h2 className="font-semibold text-4xl text-slate-500 my-3 p-2">
                Selling Properties
              </h2>
              <Link
                to={"/search?type=sale"}
                className="text-blue-600 hover:underline p-2"
              >
                Show more properties
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem item={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {offerListings && offerListings.length > 0 && (
          <div>
            <div>
              <h2 className="font-semibold text-4xl text-slate-500 my-3 p-2">
                Property for Rent
              </h2>
              <Link
                to={"/search?type=rent"}
                className="text-blue-600 hover:underline p-2"
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem item={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
